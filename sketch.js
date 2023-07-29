// Initial values and global variable declarations
// ===============================================
// Fonts
let garamond, garamondIt;

// Piece initial parameter and "scores" to keep
let params, piece, scene;

// Text
let corpus, dramaturg;

// Sound and film
let sonic, film;

// Preload media
// =================
function preload() {
  // Load json files
  corpus = loadJSON("assets/text/text.json");
  params = loadJSON("assets/init.json");

  // Font sources
  garamond = loadFont('assets/font/EBGaramond-VariableFont_wght.ttf');
  garamondIt = loadFont('assets/font/EBGaramond-Italic-VariableFont_wght.ttf');

  // Film
  film = new Film();

  // Sound
  sonic = new Sonic();
  sonic.soundLoader();
}


// Setup function
// ==============
function setup() {
  // Canvas setup
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CORNER);
  //noCursor();

  // Load corpus and build scenes
  dramaturg = new Dramaturg(corpus);
  scene = new Scene(dramaturg, film, garamond, garamondIt);

  // Create piece object to track scores
  piece = new Piece();
}

// Draw function
// =============
function draw() {
  scene.show();
  //piece.showScore();
}


// Interaction
// ===========

// Keyboard
function keyPressed() {
  switch (keyCode) {
    case ENTER:
      enterFunc();
      break;

    case DOWN_ARROW:
      downFunc();
      break;

    case ESCAPE:
      escFunc();
      break;
  }
  // Surpress other key entered response
  return false;
}

// In the case of mobile device
// ----------------------------
function touchEnded() {
  if (piece.scene == "intro") {
    enterFunc();
  }

  if (piece.storyCount > 0) {
    downFunc();
  }

  // Prevent default behaviour
  return false;
}


// Wrapper functions for interaction button
// ========================================
function enterFunc() {
  // Activate audio
  if (piece.audioOn == 0) {
    piece.audioOn = 1;
  }

  // Set scene to main and update videos
  scene.set("main");
  scene.grid.updateTiles(scene.film.vid);
  scene.grid.setupTiles(scene.film.vid);

  // Update text
  scene.drama.updateText();

  // Play sound
  sonic.playCluster("neutral", scene.drama.diary.rate);
}


function downFunc() {
  // Update score
  piece.addCount(scene.drama);

  // Update the video 
  scene.grid.updateTiles(scene.film.vid);
  scene.grid.setupTiles(scene.film.vid);
  scene.drama.updateText();

  // Play sound
  sonic.playCluster("neutral", scene.drama.diary.rate);

  // Play sound when specific sentiment takes place
  if (piece.longingCount % 3 == 0) {
    sonic.playCluster("longing", scene.drama.diary.rate);
  }
  if (piece.fearCount % 4 == 0) {
    sonic.playCluster("fear", scene.drama.diary.rate);
  }

  // Change to interlude scene when conditions are fulfilled
  if (piece.storyCount % 6 == 0 && piece.storyCount > 0) {
    scene.set("interlude");
    scene.gallery.update();

    // sound
    if (sonic.currentSong != null && sonic.currentSong.isPlaying()) {
      sonic.currentSong.stop();
    }

    if (sonic.currentWalker != null && sonic.currentWalker.isPlaying()) {
      sonic.currentWalker.stop();
    }

    sonic.playRandom("song");
  } else {
    scene.set("main");

    if (sonic.currentSong != null && sonic.currentSong.isPlaying()) {
      sonic.currentSong.stop();
    }
  }

  // Playback a walker object when the conditions are fulfilled
  if (piece.storyCount % 2 == 0 && piece.storyCount > 0 && scene.name == "main") {
    if (sonic.currentWalker != null && sonic.currentWalker.isPlaying()) {
      sonic.currentWalker.stop();
    }
    sonic.playRandom("walker");
  }
}

function escFunc() {
  scene.set("ending");
  sonic.playCluster("neutral", scene.drama.diary.rate);
  if (sonic.currentWalker != null && sonic.currentWalker.isPlaying()) {
    sonic.currentWalker.stop();
  }
}



// OTHER
// =====
// Accomodating the changed window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}