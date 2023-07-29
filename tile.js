class Tile {
    constructor(xpos, ypos, xdiv, ydiv) {
        // Tile properties
        this.x = xpos;
        this.y = ypos;
        this.xdiv = xdiv;
        this.ydiv = ydiv;
        this.w = width / xdiv;
        this.h = height / ydiv;
        console.log(this.h);

        // Initialize Video properties
        this.id = 0;
        this.vid = null;
        this.xvidMin = 500;
        this.xvidMax = 0;
        this.yvidMin = 0;
        this.yvidMax = 0;
        this.srcx = 0;
        this.srcy = 0;

        // Overlay properties
        this.prob = random();
    }

    setupVid(vidArr) {
        this.vid = vidArr[this.id];
        this.xvidMax = this.vid.width - 2 * (this.vid.width / this.xdiv);
        this.yvidMax = this.vid.height - this.vid.height / this.ydiv;
        this.srcx = random(this.xvidMin, this.xvidMax);
        this.srcy = random(this.yvidMin, this.yvidMax);

        // choose random position in time and play the video
        let vidDuration = this.vid.duration();
        let timePoint = vidDuration * random();
        this.vid.time(timePoint).play();
    }

    showOverlay() {
        noStroke();
        fill(0, 120); // 20
        let prob = this.prob;
        let x = this.x;
        let y = this.y;

        if (prob >= 0 && prob < 0.1) {
            rect(x, y, this.w, this.h);
        } else if (prob >= 0.1 && prob < 0.2) {
            ellipse(x, y, this.w, this.h);
        } else if (prob >= 0.2 && prob < 0.4) {
            triangle(
                x, y,
                x, y + this.h,
                x + this.w, y + this.h
            );
        } else if (prob >= 0.4 && prob < 0.6) {
            triangle(
                x, y,
                x, y + this.h,
                x + this.w, y
            );
        } else if (prob >= 0.6 && prob < 0.8) {
            triangle(
                x, y + this.h,
                x + this.w, y,
                x + this.w, y + this.h
            );
        } else if (prob >= 0.8 && prob < 1) {
            triangle(
                x, y,
                x + this.w, y,
                x + this.w, y + this.h
            );
        }
    }


    showVid() {
        // choose video and calculate related feature
        image(
            this.vid,
            this.x, this.y, this.w, this.h,
            this.srcx, this.srcy, this.vid.width / this.xdiv, this.vid.height / this.ydiv,
            COVER, CENTER
        );
    }

    update(id) {
        // update the video and the position to take
        this.id = id;
        // choose overlay
        this.prob = random();
    }
}


class Overlay {
    constructor(xdiv, ydiv) {
        this.xdiv = xdiv;
        this.ydiv = ydiv;
        this.xdistance = width / xdiv;
        this.ydistance = height / ydiv;

        // Create probability values
        this.probValues = [];
        for (let i = 0; i < xdiv; i++) {
            this.probValues[i] = [];
            for (let j = 0; j < ydiv; j++) {
                this.probValues[i][j] = random();
            }
        }
    }

    show() {
        noStroke();
        fill(0, 50); // best 50 oppacitiy
        for (let i = 0; i < this.xdiv; i++) {
            for (let j = 0; j < this.ydiv; j++) {

                let prob = this.probValues[i][j];
                let x = i * this.xdistance;
                let y = j * this.ydistance;

                if (prob >= 0 && prob < 0.1) {
                    rect(x, y, this.xdistance, this.ydistance);
                } else if (prob >= 0.1 && prob < 0.2) {
                    ellipse(x, y, this.xdistance, this.ydistance);
                } else if (prob >= 0.2 && prob < 0.4) {
                    triangle(
                        x, y,
                        x, y + this.ydistance,
                        x + this.xdistance, y + this.ydistance
                    );
                } else if (prob >= 0.4 && prob < 0.6) {
                    triangle(
                        x, y,
                        x, y + this.ydistance,
                        x + this.xdistance, y
                    );
                } else if (prob >= 0.6 && prob < 0.8) {
                    triangle(
                        x, y + this.ydistance,
                        x + this.xdistance, y,
                        x + this.xdistance, y + this.ydistance
                    );
                } else if (prob >= 0.8 && prob < 1) {
                    triangle(
                        x, y,
                        x + this.xdistance, y,
                        x + this.xdistance, y + this.ydistance
                    );
                }
            }
        }
    }

    update() {
        for (let i = 0; i < this.xdiv; i++) {
            for (let j = 0; j < this.ydiv; j++) {
                this.probValues[i][j] = random();
            }
        }
    }
}


class Grid {
    // A class to wrap a collection of tiles
    constructor(w, h, xdiv, ydiv) {
        this.xdistance = w / xdiv;
        this.ydistance = h / ydiv;
        this.xdiv = xdiv;
        this.ydiv = ydiv;

        // initialize tiles
        this.tiles = [];
        for (let i = 0; i < xdiv; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < ydiv; j++) {
                this.tiles[i][j] = new Tile(i * this.xdistance, j * this.ydistance, xdiv, ydiv);
            }
        }

        // initialize overlay
        let factor = 10;
        this.overlay = new Overlay(xdiv * factor, ydiv * factor);
    }

    // Update properties of tiles
    updateTiles(vidArr) {
        let newId = floor(random(vidArr.length));
        for (let i = 0; i < this.xdiv; i++) {
            for (let j = 0; j < this.ydiv; j++) {
                this.tiles[i][j].update(newId);
            }
        }
        this.overlay.update();
    }

    // Setup the videos in each tiles
    setupTiles(vidArr) {
        for (let i = 0; i < this.xdiv; i++) {
            for (let j = 0; j < this.ydiv; j++) {
                this.tiles[i][j].setupVid(vidArr);
            }
        }
    }

    // Draw the tiles into window
    showTiles() {
        for (let i = 0; i < this.xdiv; i++) {
            for (let j = 0; j < this.ydiv; j++) {
                this.tiles[i][j].showVid();
                this.tiles[i][j].showOverlay();
            }
        }
        this.overlay.show();
    }
}