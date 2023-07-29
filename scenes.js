class Scene {
    constructor(drama, filmObj, fontNormal, fontItalic) {
        this.name = "intro";
        this.drama = drama;
        this.fontNormal = fontNormal;
        this.fontItalic = fontItalic;
        this.xloc = width / 6;

        this.film = filmObj; //new Film();
        this.grid = new Grid(width, height, 5, 3);
        this.textbox = new TextBox(this.drama, this.grid, this.fontNormal, this.fontItalic);

        this.gallery = new Gallery();
    }

    show() {
        switch (this.name) {
            case "intro":
                this.intro();
                break;
            case "main":
                this.main();
                break;
            case "interlude":
                this.interlude();
                break;
            case "ending":
                this.ending();
                break;
        }
    }

    set(name) {
        this.name = name;
    }

    intro() {
        background(0);
        stroke(255);
        strokeWeight(0.5);
        fill(255);
        textSize(50);
        textFont(this.fontItalic);
        text("Of Longing and Fear", this.xloc, height / 2);

        textSize(30);
        textFont(this.fontNormal);
        text(
            "Diary entries from the Japanese occupation time in Indonesia 1942-1945",
            this.xloc,
            height / 2 + 50
        );

        text("***", this.xloc, height / 2 + 2 * 50);

        text(
            "Press ENTER to start, press DOWN to read stories, press ESC to exit.",
            this.xloc,
            height / 2 + 2.75 * 50
        );
    }

    main() {
        background(0);
        this.grid.showTiles();
        this.textbox.show();
    }

    interlude() {
        this.gallery.show();
        this.textbox.showHistory();

        // draw line grid
        stroke(0);
        strokeWeight(1);
        for (let i = 0; i < this.grid.xdiv; i++) {
            let xpos = i * this.grid.xdistance;
            line(xpos, 0, xpos, height);
        }
        for (let j = 0; j < this.grid.ydiv; j++) {
            let ypos = j * this.grid.ydistance;
            line(0, ypos, width, ypos);
        }

    }

    ending() {
        background(0);
        stroke(255);
        strokeWeight(0.5);
        fill(255);
        textSize(50);
        textFont(this.fontItalic);
        text("The End", this.xloc, height / 2);
        textAlign(LEFT);

        textSize(30);
        textFont(this.fontNormal);
        text(
            "Thank you for reading",
            this.xloc,
            height / 2 + 50
        );
        text("***", this.xloc, height / 2 + 2 * 50);
        text("Press ENTER to restart", this.xloc, height / 2 + 2.75 * 50);
    }

    getTag() {
        return this.drama.diary.tag;
    }
}


class Piece {
    constructor() {
        // Scene selector and information
        this.scene = "intro";

        // Scores
        this.storyCount = 0;
        this.fearCount = 1;
        this.longingCount = 1;

        // Sound status
        this.audioOn = 0;
    }

    addCount(drama) {
        this.storyCount++;
        if (drama.diary.tag == "longing") {
            this.longingCount++;
        } else if (drama.diary.tag == "fear") {
            this.fearCount++;
        }
    }

    showScore() {
        textSize(30);
        textAlign(CENTER, CENTER);
        text("Story: " + this.storyCount, width / 2 - 400, 100);
        text("Longing: " + this.longingCount, width / 2, 100);
        text("Fear: " + this.fearCount, width / 2 + 400, 100);
    }
}
