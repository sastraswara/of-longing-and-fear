class Dramaturg {
    constructor(corp) {
        // Diary entry
        this.diurna = corp.diaries;
        this.diaryInd = this.rollIndex(this.diurna);
        this.diary = this.diurna[this.diaryInd];

        // History entry
        this.hist = corp.history;
        this.histInd = this.rollIndex(this.hist);
        this.date = this.hist[this.histInd].date;
        this.placeInd = this.rollIndex(this.hist);
        this.place = this.hist[this.placeInd].place;
    }

    rollIndex(arr) {
        return floor(random(arr.length));
    }

    updateText() {
        this.placeInd = this.rollIndex(this.hist);
        this.histInd = this.rollIndex(this.hist);
        this.diaryInd = this.rollIndex(this.diurna);

        this.diary = this.diurna[this.diaryInd];
        this.date = this.hist[this.histInd].date;
        this.place = this.hist[this.placeInd].place;
    }
}


class TextBox {
    constructor(dramaObj, gridObj, fontNormal, fontItalic) {
        this.grid = gridObj;
        this.fontNormal = fontNormal;
        this.fontItalic = fontItalic;
        this.drama = dramaObj;
    }

    show() {
        noStroke()
        fill(0, 200);
        rect(
            this.grid.xdistance, 2.5 * this.grid.ydistance - 40,
            3 * this.grid.xdistance, this.grid.ydistance
        );

        stroke(255);
        strokeWeight(0.5);
        fill(255);
        textSize(30);
        textLeading(30);
        textAlign(CENTER, TOP);

        let margin = 20;
        textFont(this.fontItalic);
        text(
            "(" + this.drama.place + ", " + this.drama.date + ")",
            this.grid.xdistance + margin,
            2.5 * this.grid.ydistance - margin,
            3 * this.grid.xdistance - 2 * margin,
            1.25 * this.grid.ydistance - margin
        );

        textFont(this.fontNormal);
        text(
            //para.join(' '),
            this.drama.diary.entry,
            this.grid.xdistance + margin,
            2.5 * this.grid.ydistance + margin,
            3 * this.grid.xdistance - 2 * margin,
            1.25 * this.grid.ydistance - margin
        );

        //console.log(this.drama.entry);
    }

    showHistory() {
        noStroke();
        fill(255, 150);
        rect(0, 0, width, height);

        let margin = 40;
        let x1 = width / 12; //this.grid.xdistance;
        let y1 = margin;
        let xw = width - 2 * x1; //3 * this.grid.xdistance;
        let yh = height - margin; //this.grid.ydistance;

        //rect(x1, y1, xw, yh);

        let hist = this.drama.hist[this.drama.histInd];
        let placeTime = hist.place + ", " + hist.date + ". " + hist.event + ".";

        stroke(0);
        strokeWeight(1);
        fill(0);
        textLeading(150);
        textSize(150);
        textAlign(LEFT, CENTER);

        text(placeTime, x1, y1, xw, yh);
    }
}


class Film {
    constructor() {
        this.src = [
            'assets/video/bekerdja-01.mp4',
            'assets/video/bekerdja-02.mp4',
            'assets/video/djaga-01-a.mp4',
            'assets/video/djaga-01-b.mp4',
            'assets/video/djaga-02.mp4',
            'assets/video/djawa-01.mp4',
            'assets/video/djawa-02.mp4',
            'assets/video/djawa-03.mp4',
            'assets/video/medan-01.mp4',
            'assets/video/medan-02.mp4',
            'assets/video/medan-03.mp4',
            'assets/video/tonari-01.mp4',
        ];

        // load video
        this.vid = [];
        for (let i = 0; i < this.src.length; i++) {
            let thisVid = createVideo(this.src[i]);
            thisVid.loop();
            thisVid.volume(0);
            //thisVid.play();
            thisVid.hide();
            this.vid.push(thisVid);
        };
    }
}

class Gallery {
    constructor() {
        //this.imagePaths = imagePaths;
        this.imagePaths = [
            "assets/images/garis.jpg",
            "assets/images/kota-arwah.jpg",
            "assets/images/mantra.jpg",
            "assets/images/melepas-arwah.jpg",
            "assets/images/monumen-arwah-2.jpg",
            "assets/images/serangan-arwah.jpg"
        ];

        // load images
        this.img = [];
        for (let i = 0; i < this.imagePaths.length; i++) {
            this.img.push(loadImage(this.imagePaths[i]));
        }

        this.id = 0;
    }

    show() {
        let currentImg = this.img[this.id];
        image(currentImg,
            0, 0, width, height,
            0, 0, currentImg.width, currentImg.height,
            COVER, CENTER, CENTER
        );
        filter(GRAY);
    }

    update() {
        this.id = floor(random(this.img.length));
    }
}