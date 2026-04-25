// 全域變數定義
let shapes = [];
let song;
let amplitude;

// 外部定義的二維陣列，做為多邊形頂點的基礎座標
let points = [
  [-3, 5],
  [5, 6],
  [8, 0],
  [4, -5],
  [-4, -4],
  [-6, 0]
];

function preload() {
  // 在程式開始前預載入外部音樂資源
  song = loadSound('sunset-beach-259654.mp3');
}

function setup() {
  // 初始化畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化 p5.Amplitude 物件
  amplitude = new p5.Amplitude();

  // 產生 10 個形狀物件
  for (let i = 0; i < 10; i++) {
    // 透過 map() 讀取全域陣列 points，產生變形
    let deformedPoints = points.map(p => {
      // 將每個頂點的 x 與 y 分別乘上 10 到 30 之間的隨機倍率
      let multX = random(10, 30);
      let multY = random(10, 30);
      return [p[0] * multX, p[1] * multY];
    });

    let shape = {
      x: random(0, windowWidth),
      y: random(0, windowHeight),
      dx: random(-3, 3),
      dy: random(-3, 3),
      scale: random(1, 10), // 依據 JSON 結構保留此屬性
      color: color(random(255), random(255), random(255)),
      points: deformedPoints
    };

    shapes.push(shape);
  }
}

function draw() {
  // 設定背景顏色
  background('#ffcdb2');
  // 設定邊框粗細
  strokeWeight(2);

  // 取得當前音量大小 (0 ~ 1)
  let level = amplitude.getLevel();
  // 映射音量到縮放倍率 (0.5 ~ 2)
  let sizeFactor = map(level, 0, 1, 0.5, 2);

  // 走訪並更新繪製每個形狀
  for (let shape of shapes) {
    // 位置更新
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈檢查
    if (shape.x < 0 || shape.x > windowWidth) {
      shape.dx *= -1;
    }
    if (shape.y < 0 || shape.y > windowHeight) {
      shape.dy *= -1;
    }

    // 設定外觀
    fill(shape.color);
    stroke(shape.color);

    // 座標轉換與縮放
    push();
    translate(shape.x, shape.y);
    scale(sizeFactor); // 依照音樂音量縮放

    // 繪製多邊形
    beginShape();
    for (let p of shape.points) {
      vertex(p[0], p[1]);
    }
    endShape(CLOSE);
    
    // 狀態還原
    pop();
  }
}

// 額外加入：處理瀏覽器自動播放策略，點擊畫面以確保音訊啟動
function mousePressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  if (song.isPlaying()) {
    song.stop();
  } else {
    song.loop();
  }
}
