class Sonic {
    constructor() {
        // Array paths
        this.samplePaths = {
            "bamboo": [
                "assets/samples/bamboo/01-bamboo-lo-01.mp3",
                "assets/samples/bamboo/02-bamboo-lo-02.mp3",
                "assets/samples/bamboo/03-bamboo-lo-03.mp3",
                "assets/samples/bamboo/04-bamboo-mid-01.mp3",
                "assets/samples/bamboo/05-bamboo-mid-02.mp3",
                "assets/samples/bamboo/06-bamboo-mid-03.mp3",
                "assets/samples/bamboo/07-bamboo-hi-01.mp3",
                "assets/samples/bamboo/08-bamboo-hi-02.mp3",
                "assets/samples/bamboo/09-bamboo-hi-03.mp3"
            ],
            "bonang": [
                "assets/samples/bonang/01-bonang-lo-01.mp3",
                "assets/samples/bonang/02-bonang-lo-02.mp3",
                "assets/samples/bonang/03-bonang-lo-03.mp3",
                "assets/samples/bonang/04-bonang-mid-01.mp3",
                "assets/samples/bonang/05-bonang-mid-02.mp3",
                "assets/samples/bonang/06-bonang-mid-03.mp3",
                "assets/samples/bonang/07-bonang-hi-01.mp3",
                "assets/samples/bonang/08-bonang-hi-02.mp3",
                "assets/samples/bonang/09-bonang-hi-03.mp3"
            ],
            "chime": [
                "assets/samples/chime/01-chime-lo-01.mp3",
                "assets/samples/chime/02-chime-lo-02.mp3",
                "assets/samples/chime/03-chime-lo-03.mp3",
                "assets/samples/chime/04-chime-mid-01.mp3",
                "assets/samples/chime/05-chime-mid-02.mp3",
                "assets/samples/chime/06-chime-mid-03.mp3",
                "assets/samples/chime/07-chime-hi-01.mp3",
                "assets/samples/chime/08-chime-hi-02.mp3",
                "assets/samples/chime/09-chime-hi-03.mp3"
            ],
            "glass": [
                "assets/samples/glass/01-glass-lo-01.mp3",
                "assets/samples/glass/02-glass-lo-02.mp3",
                "assets/samples/glass/03-glass-lo-03.mp3",
                "assets/samples/glass/04-glass-mid-01.mp3",
                "assets/samples/glass/05-glass-mid-02.mp3",
                "assets/samples/glass/06-glass-mid-03.mp3",
                "assets/samples/glass/07-glass-hi-01.mp3",
                "assets/samples/glass/08-glass-hi-02.mp3",
                "assets/samples/glass/09-glass-hi-03.mp3"
            ],
            "song": [
                "assets/samples/song/01-keroncong.mp3",
                "assets/samples/song/02-minuet.mp3",
                "assets/samples/song/03-purnama.mp3",
                "assets/samples/song/04-sakura.mp3",
                "assets/samples/song/05-londonderry.mp3"
            ],
            "walker": [
                "assets/samples/walker/01-tarung-01.mp3",
                "assets/samples/walker/02-tarung-02.mp3",
                "assets/samples/walker/03-hirajoshi-01.mp3",
                "assets/samples/walker/04-hirajoshi-02.mp3",
                "assets/samples/walker/05-pulsa-01.mp3",
                "assets/samples/walker/06-pulsa-02.mp3",
                "assets/samples/walker/07-cluster-01.mp3",
                "assets/samples/walker/08-cluster-02.mp3"
            ]
        };

        this.samples = {};
        this.currentSong = null;
        this.currentWalker = null;
    }

    soundLoader() {
        let sampleKeys = Object.keys(this.samplePaths);
        for (let i = 0; i < sampleKeys.length; i++) {
            let currentKey = sampleKeys[i];
            let currentPath = this.samplePaths[currentKey];

            let sampleArray = [];
            for (let j = 0; j < currentPath.length; j++) {
                sampleArray.push(loadSound(currentPath[j]));
            }
            this.samples[currentKey] = sampleArray;
        }
    }

    playCluster(sentiment, density) {
        // Choose sample to play based on sentiment
        let soundSample;
        switch (sentiment) {
            case "neutral":
                soundSample = this.samples.bonang;
                break;
            case "longing":
                let coin = random();
                if (coin < 0.5) {
                    soundSample = this.samples.chime;
                } else {
                    soundSample = this.samples.bamboo;
                }
                break;
            case "fear":
                soundSample = this.samples.glass;
        }

        // Choose sample index based on density value
        let sampIndex;
        switch (density) {
            case 1:
                sampIndex = random([0, 1, 2]);
                break;
            case 2:
                sampIndex = random([3, 4, 5]);
                break;
            case 3:
                sampIndex = random([6, 7, 8]);
        }

        // Play sound
        soundSample[sampIndex].play();
    }

    playRandom(sampKey) {
        let soundIndex = floor(random(this.samples[sampKey].length));
        let currentSample = this.samples[sampKey][soundIndex];
        switch (sampKey) {
            case "song":
                this.currentSong = currentSample;
                break;
            case "walker":
                this.currentWalker = currentSample;
                break;
        }
        currentSample.play();
        currentSample.setVolume(1);
    }
}


class BernoulliStep {
    constructor(name, sample, tempo) {
        this.sample = sample;
        this.sequence = this.newSequence(0.6);
        this.phrase = new p5.Phrase(
            name,
            this.textureFunc,
            this.sequence
        );
        this.part = new p5.Part();
        this.part.addPhrase(this.phrase);
        this.part.setBPM(tempo);

        // envelope
    }

    newSequence(onProb) {
        let pattern = [];
        for (let i = 0; i < 16; i++) {
            let coin = random();
            if (coin < onProb) {
                pattern.push(this.sample);
            } else {
                pattern.push(0);
            }
        }
        return pattern;
    }

    textureFunc(time, s) {
        let scaledRate = 1; //random(0.98, 1.02) * random([-1, 1]);
        //s.rate(scaledRate);
        let totalDur = s.duration();
        let soundCue = random(0, 0.8) * totalDur;
        let grainDur = random(0.1, 1);
        let amp = 0.8;
        s.play(time, scaledRate, amp, soundCue, grainDur);
    }

    loopPart() {
        this.part.loop();
    }

    stopPart() {
        this.part.stop();
        this.sample.stop();
    }
}