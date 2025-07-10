// animation.js

// Pattern interface
class Pattern {
    constructor(width, height, charset) {
        this.width = width;
        this.height = height;
        this.charset = charset;
    }
    // Should return a 2D array of characters for the given frame
    generateFrame(frameIndex) {
        throw new Error('generateFrame() must be implemented by subclass');
    }
}

// Wave pattern
class WavePattern extends Pattern {
    generateFrame(frameIndex) {
        const output = [];
        for (let y = 0; y < this.height; y++) {
            let row = '';
            for (let x = 0; x < this.width; x++) {
                const wave = Math.sin((x + frameIndex) * 0.3 + y * 0.2);
                const charIndex = Math.floor((wave + 1) / 2 * (this.charset.length - 1));
                row += this.charset[charIndex];
            }
            output.push(row);
        }
        return output;
    }
}

// Lightning pattern
class LightningPattern extends Pattern {
    generateFrame(frameIndex) {
        // Fast, jagged, vertical streaks
        const output = [];
        for (let y = 0; y < this.height; y++) {
            let row = '';
            for (let x = 0; x < this.width; x++) {
                // Lightning: random vertical streaks, fast movement
                const streak = Math.abs(Math.sin((x * 0.7 + frameIndex * 2) + Math.random() * 2));
                const charIndex = streak > 0.8 ? this.charset.length - 1 : Math.floor(Math.random() * this.charset.length);
                row += this.charset[charIndex];
            }
            output.push(row);
        }
        return output;
    }
}

// Spiral pattern
class SpiralPattern extends Pattern {
    generateFrame(frameIndex) {
        // Swirling spiral effect
        const output = [];
        const cx = this.width / 2;
        const cy = this.height / 2;
        const maxR = Math.min(cx, cy) * 0.95;
        for (let y = 0; y < this.height; y++) {
            let row = '';
            for (let x = 0; x < this.width; x++) {
                const dx = x - cx;
                const dy = y - cy;
                const r = Math.sqrt(dx * dx + dy * dy);
                const theta = Math.atan2(dy, dx);
                // Spiral: use radius and angle, animate with frameIndex
                const spiral = Math.sin(r * 0.7 - theta * 2 + frameIndex * 0.2 + r * 0.15);
                const charIndex = Math.floor((spiral + 1) / 2 * (this.charset.length - 1));
                row += this.charset[charIndex];
            }
            output.push(row);
        }
        return output;
    }
}

// Random pattern
class RandomPattern extends Pattern {
    generateFrame(frameIndex) {
        // Lively, noisy pattern
        const output = [];
        for (let y = 0; y < this.height; y++) {
            let row = '';
            for (let x = 0; x < this.width; x++) {
                // Animate random noise
                const noise = Math.random() + Math.sin((x + y + frameIndex) * 0.5);
                const charIndex = Math.floor(Math.abs(noise) % 1 * (this.charset.length - 1));
                row += this.charset[charIndex];
            }
            output.push(row);
        }
        return output;
    }
}

// Rain pattern (stub)
class RainPattern extends Pattern {
    generateFrame(frameIndex) {
        // TODO: Implement rain pattern
        return Array(this.height).fill(' '.repeat(this.width));
    }
}

// Animation Engine
class AnimationEngine {
    constructor({width, height, charset, pattern, fps = 30, onFrame}) {
        this.width = width;
        this.height = height;
        this.charset = charset;
        this.pattern = pattern;
        this.fps = fps;
        this.onFrame = onFrame;
        this.frameIndex = 0;
        this.running = false;
        this._interval = null;
    }

    start() {
        if (this.running) return;
        this.running = true;
        this._interval = setInterval(() => {
            this.renderFrame();
        }, 1000 / this.fps);
    }

    stop() {
        this.running = false;
        if (this._interval) clearInterval(this._interval);
        this._interval = null;
    }

    renderFrame() {
        const frame = this.pattern.generateFrame(this.frameIndex++);
        if (this.onFrame) this.onFrame(frame);
    }

    setPattern(pattern) {
        this.pattern = pattern;
        this.frameIndex = 0;
    }

    setCharset(charset) {
        this.charset = charset;
        if (this.pattern) this.pattern.charset = charset;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        if (this.pattern) {
            this.pattern.width = width;
            this.pattern.height = height;
        }
    }

    setFPS(fps) {
        this.fps = fps;
        if (this.running) {
            this.stop();
            this.start();
        }
    }
}

// Export classes for use in UI
window.AnimationEngine = AnimationEngine;
window.Patterns = { WavePattern, SpiralPattern, RainPattern, RandomPattern, LightningPattern }; 