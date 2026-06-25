const fs = require('fs');
const path = require('path');

class NeuralNetwork {
    constructor() {
        this.layers = [
            { inputSize: 4, outputSize: 8 },
            { inputSize: 8, outputSize: 8 },
            { inputSize: 8, outputSize: 3 }
        ];
        this.weights = [];
        this.biases = [];
        this.isLoaded = false;
    }

    loadWeights(filePath) {
        try {
            const buffer = fs.readFileSync(filePath);
            let offset = 0;

            for (let i = 0; i < this.layers.length; i++) {
                const layer = this.layers[i];
                const paddedOutputSize = Math.ceil(layer.outputSize / 8) * 8;
                
                const weightsSize = layer.inputSize * paddedOutputSize * 4;
                const weightsBuffer = buffer.slice(offset, offset + weightsSize);
                const layerWeights = new Float32Array(weightsBuffer.buffer, weightsBuffer.byteOffset, layer.inputSize * paddedOutputSize);
                this.weights.push(layerWeights);
                offset += weightsSize;

                const biasSize = paddedOutputSize * 4;
                const biasBuffer = buffer.slice(offset, offset + biasSize);
                const layerBiases = new Float32Array(biasBuffer.buffer, biasBuffer.byteOffset, paddedOutputSize);
                this.biases.push(layerBiases);
                offset += biasSize;
            }
            this.isLoaded = true;
            console.log("Neural Network weights loaded successfully.");
        } catch (error) {
            console.error("Failed to load Neural Network weights:", error);
        }
    }

    leakyReLU(x) {
        return x > 0 ? x : x * 0.01;
    }

    predict(features) {
        if (!this.isLoaded) {
            throw new Error("Model weights not loaded");
        }

        // features = [Age(0-1), Fitness(0-1), SpO2(0-1), HR(0-1)]
        let currentOutputs = new Float32Array(features);

        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            const paddedOutputSize = Math.ceil(layer.outputSize / 8) * 8;
            const nextOutputs = new Float32Array(paddedOutputSize);
            const w = this.weights[i];
            const b = this.biases[i];

            // Initialize with bias
            for (let j = 0; j < paddedOutputSize; j++) {
                nextOutputs[j] = b[j];
            }

            // Matrix multiplication
            for (let k = 0; k < layer.inputSize; k++) {
                const inVal = currentOutputs[k];
                for (let j = 0; j < paddedOutputSize; j++) {
                    nextOutputs[j] += inVal * w[k * paddedOutputSize + j];
                }
            }

            // Activation (LeakyReLU)
            for (let j = 0; j < paddedOutputSize; j++) {
                nextOutputs[j] = this.leakyReLU(nextOutputs[j]);
            }

            currentOutputs = nextOutputs;
        }

        return {
            hrAbnormal: currentOutputs[0] > 0.5,
            hrScore: currentOutputs[0],
            spo2Abnormal: currentOutputs[1] > 0.5,
            spo2Score: currentOutputs[1],
            disease: currentOutputs[2] > 0.5,
            diseaseScore: currentOutputs[2]
        };
    }
}

// Singleton instance
const nn = new NeuralNetwork();
const modelPath = path.join(__dirname, '..', 'ml', 'model_weights.bin');
if (fs.existsSync(modelPath)) {
    nn.loadWeights(modelPath);
} else {
    console.warn("model_weights.bin not found at", modelPath);
}

module.exports = nn;