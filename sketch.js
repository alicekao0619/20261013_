let questions = []; 
let table; 

let currentQuestion = 0; 
let score = 0; 
let selectedOption = -1; 
let isAnswered = false; 
let jumpOffset = 0; 

let layout = {};

function preload() {
  console.log("1. 開始預載入 CSV...");
  table = loadTable('questions.csv', 'csv', 'header');
}

function setup() { 
  console.log("2. CSV 載入成功，進入 setup...");
  createCanvas(windowWidth, windowHeight); 
  textFont("'Anton', 'Noto Sans HK'");
  textAlign(CENTER, CENTER); 
  
  console.log("3. 開始解析題庫並抽題...");
  parseAndSelectQuestions();
  
  console.log("4. 更新介面排版...");
  updateLayout();
  console.log("5. 初始化全部完成！");
}


function parseAndSelectQuestions() {
  let allQuestions = [];
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    allQuestions.push({
      question: row.getString('question'),
      options: [
        row.getString('option0'),
        row.getString('option1'),
        row.getString('option2'),
        row.getString('option3')
      ],
      answer: row.getNum('answer')
    });
  }
  // 使用 p5.js 內建洗牌函數，並從 15 題中抽出 5 題
  let shuffled = shuffle(allQuestions);
  questions = shuffled.slice(0, 5);
}

function updateLayout() { 
  let isLandscape = width > height; 
  let baseSize = min(width, height); 
  
  layout.btnW = isLandscape ? min(width * 0.65, 600) : width * 0.88; 
  layout.btnH = min(height * 0.075, 55); 
  
  layout.titleY = height * 0.07; 
  layout.questionY = height * 0.16; 
  layout.startY = height * 0.28; 
  layout.gap = min(height * 0.105, 68); 
  
  layout.nextW = isLandscape ? min(width * 0.25, 220) : min(width * 0.5, 260); 
  layout.nextH = min(height * 0.07, 50); 
  layout.nextX = width / 2 - layout.nextW / 2; 
  layout.nextY = layout.startY + 4 * layout.gap + height * 0.015; 
  
  layout.titleSize = max(baseSize * 0.045, 20); 
  layout.questionSize = max(baseSize * 0.032, 15); 
  layout.optionSize = max(baseSize * 0.028, 14); 
  layout.buttonTextSize = max(baseSize * 0.03, 16); 
}

function draw() { 
  background(240); 
  displayTitle(); 
  if (currentQuestion < questions.length) { 
    displayQuiz(); 
  } else { 
    displayResult(); 
  }
}

function displayTitle() { 
  fill(50, 80, 120); 
  noStroke(); 
  textStyle(BOLD); 
  textSize(layout.titleSize); 
  text("程式設計小測驗", width / 2, layout.titleY); 
  textStyle(NORMAL); 
}

function displayQuiz() { 
  if (questions.length === 0) return;
  let q = questions[currentQuestion]; 
  
  fill(30); 
  textSize(layout.questionSize); 
  rectMode(CENTER); 
  text(q.question, width / 2, layout.questionY, layout.btnW, height * 0.12); 
  rectMode(CORNER); 
  
  if (isAnswered) { 
    jumpOffset = sin(frameCount * 0.15) * (layout.btnH * 0.2); 
  } else { 
    jumpOffset = 0; 
  } 
  
  for (let i = 0; i < q.options.length; i++) { 
    let x = width / 2 - layout.btnW / 2; 
    let y = layout.startY + i * layout.gap; 
    
    let bgColor = color(255); 
    let strokeColor = color(200); 
    let currentY = y; 
    
    if (isAnswered) { 
      if (i === q.answer) { 
        bgColor = color(180, 240, 180); 
        strokeColor = color(40, 160, 40); 
        currentY += jumpOffset; 
      } 
      else if (i === selectedOption && selectedOption !== q.answer) { 
        bgColor = color(255, 200, 200); 
        strokeColor = color(200, 50, 50); 
      } 
    } 
    
    fill(bgColor); 
    stroke(strokeColor); 
    strokeWeight(2); 
    rect(x, currentY, layout.btnW, layout.btnH, 10); 
    
    fill(0); 
    noStroke(); 
    textSize(layout.optionSize); 
    text(q.options[i], width / 2, currentY + layout.btnH / 2); 
  } 
  
  if (isAnswered) { 
    drawNextButton(); 
  }
}

function drawNextButton() { 
  fill(70, 130, 180); 
  stroke(255); 
  strokeWeight(2); 
  rect(layout.nextX, layout.nextY, layout.nextW, layout.nextH, 8); 
  
  fill(255); 
  noStroke(); 
  textSize(layout.buttonTextSize); 
  text("下一題", width / 2, layout.nextY + layout.nextH / 2);
}

function mouseClicked() { 
  if (currentQuestion >= questions.length) return; 
  
  if (!isAnswered) { 
    for (let i = 0; i < 4; i++) { 
      let x = width / 2 - layout.btnW / 2; 
      let y = layout.startY + i * layout.gap; 
      
      if (mouseX > x && mouseX < x + layout.btnW && mouseY > y && mouseY < y + layout.btnH) { 
        selectedOption = i; 
        isAnswered = true; 
        if (selectedOption === questions[currentQuestion].answer) { 
          score++; 
        } 
        break; 
      } 
    } 
  } 
  else { 
    if (mouseX > layout.nextX && mouseX < layout.nextX + layout.nextW && mouseY > layout.nextY && mouseY < layout.nextY + layout.nextH) { 
      currentQuestion++; 
      isAnswered = false; 
      selectedOption = -1; 
    } 
  }
}

function displayResult() { 
  fill(40); 
  noStroke(); 
  textSize(layout.titleSize * 1.2); 
  text("測驗結束!", width / 2, height * 0.38); 
  
  textSize(layout.questionSize * 1.2); 
  fill(70, 130, 180); 
  text("您的得分為:" + score + " / " + questions.length + " 題", width / 2, height * 0.5);
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
  updateLayout();
}
