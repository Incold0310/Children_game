let score=0; // Переменная для хранения набранныя очков
let picturesArr = [
{src:"allGraphics/images/task1/image1.jpg",isStillLife:false},
{src:"allGraphics/images/task1/image2.jpg",isStillLife:false},
{src:"allGraphics/images/task1/image3.jpg",isStillLife:true},
{src:"allGraphics/images/task1/image4.jpg",isStillLife:true},
{src:"allGraphics/images/task1/image5.jpg",isStillLife:false},
{src:"allGraphics/images/task1/image6.jpg",isStillLife:false},
{src:"allGraphics/images/task1/image7.jpg",isStillLife:true},
{src:"allGraphics/images/task1/image8.jpg",isStillLife:true},
{src:"allGraphics/images/task1/image9.jpg",isStillLife:true},
{src:"allGraphics/images/task1/image10.jpg",isStillLife:true},
{src:"allGraphics/images/task1/image11.jpg",isStillLife:true},
{src:"allGraphics/images/task1/image12.jpg",isStillLife:true},
{src:"allGraphics/images/task1/image13.jpg",isStillLife:false},
{src:"allGraphics/images/task1/image14.jpg",isStillLife:false},
{src:"allGraphics/images/task1/image15.jpg",isStillLife:false},
]; //Массив картин
let uniqueNumbers=[]; //Массив определяющий порядок отображения картин

//Функция заполняющая массив uniqueNumbers уникальными цифрами
function randomNumberGenerator() {
	let i=0;
	while(i<picturesArr.length) {
		let num=Math.floor(Math.random()*picturesArr.length);
		if (uniqueNumbers.indexOf(num)==-1) {
			uniqueNumbers.push(num);
			i++;
		}
	}
}

//Объект отвечающий за таймер
class Timer {
	constructor(elem) {
		this.elem= elem;
		this.time = this.elem.textContent;
	}
	changeTime() {//Изменяем время
		let timer=setInterval( () => {
			this.time--;
			this.elem.textContent=this.time;
			if (!this.time) {
				clearInterval(timer);
				game.endGame();
			}
		} ,1000);
	}
}

//Объект отвечающий за отображение и анимацию картин
class Picture {
	constructor(elem) {
		this.elem= elem;
	}
	startCoords(src) { //Выносим картину за пределы документа
		this.elem.style.display="block";
		this.elem.style.top= `${-this.elem.clientHeight}px`;
		this.elem.children[0].src=src;
		this.topPosition=0;
	}
	movePosition(src) { //Перемещение картины до середины экрана
		this.startCoords(src);
		document.querySelector("#devil img").src="graphicsForTask/11 9-03.png"; //Изменяем картинку чёртика
		document.querySelector("#buttons").style.pointerEvents="none"; //Делаем кнопки не кликабельными, чтобы не сломать анимацию
		let animation = setInterval(()=> {
			this.topPosition+=1;
			this.elem.style.top=`${-this.elem.clientHeight+this.topPosition}px`; //Двигаем картинку
			//Проверяем, дошла ли картинка до середины документа, то останавливаем анимацию и делаем кнопки кликабельными
			if (this.elem.style.top.slice(0,this.elem.style.top.length-2) >= document.documentElement.clientHeight/2-this.elem.clientHeight/2 || document.querySelector("#timer").textContent=="0") {
				clearInterval(animation); 
				document.querySelector("#buttons").style.pointerEvents="auto";
			}
		},5);
	}
	fastMovePosition() { //Перемещение картины после середины экрана (более быстрое)
		let fastAnimation = setInterval(()=> {
			this.topPosition+=4;
			this.elem.style.top=`${-this.elem.clientHeight+this.topPosition}px`;
			//Если вышло за пределы экрана
			if (this.elem.style.top>=`${document.documentElement.clientHeight}px`) {
				clearInterval(fastAnimation);
				this.elem.style.display="none";
			}
		},10);
	}
}

//Объект отвечающий за процесс игры
class Game {
	constructor() {
		this.isWin=0;
		this.picture = new Picture(document.querySelector("#picture"));
		this.clock = new Timer(document.querySelector("#timer"));
		this.id=0;
		this.devil = document.querySelector("#devil img");
	}
	startGame() {
		randomNumberGenerator(); //Заполняем массив uniqueNumbers
		this.clock.changeTime(); //Запускаем таймер
		//Запускаем анимацию картины, в соответстивии с превой цифрой массива uniqueNumbers
		this.picture.movePosition(picturesArr[uniqueNumbers[this.id]].src);
	}
	clickOnButtons() { //При клике на кнопку
		this.checkTrueAnswer();
		setTimeout(() => {this.picture.fastMovePosition();},500);
		setTimeout(()=>{
			this.id++;
			this.picture.movePosition(picturesArr[uniqueNumbers[this.id]].src);
		},2000);
	}
	checkTrueAnswer() { //Проверяем правильность ответа
		if((event.target.id=="stillLife"&&picturesArr[uniqueNumbers[this.id]].isStillLife==true)||(event.target.id=="stillLife_no"&&picturesArr[uniqueNumbers[this.id]].isStillLife==false)) {
			score+=10;
			document.querySelector("#score").textContent=`Счёт: ${score}`;
			this.devil.src="graphicsForTask/11 9-02.png";
		}
		else {
			this.devil.src="graphicsForTask/11 9-05.png";
		}
	}
	endGame() { //Завершение игры
		this.picture.fastMovePosition();
		setTimeout(()=>{
			document.querySelector("#mainContainer").style.display="none";
			document.querySelector("#endGame").style.display="block";
		},1500)
		if(score) {
			document.querySelector("#endGame p").textContent=`Ты справился с заданием гоблина, и ему ничего не остается, как пропустить тебя к следующим испытаниям. 
			«Но не радуйся слишком рано, - злобно шипит Гоблин тебя в след, - мы с тобой ещё встретимся, и тогда посмотрим, кто кого!»`;
		}
		else {
			document.querySelector("#endGame p").textContent=`Увы, ты не справился с заданием гоблина. Но внезапно в его холодное, злобное сердце закралась доброта: Гоблин соглашается пропустить тебя. 
			«Но смотри, - ворчит он, - не разочаруй меня: со следующими заданиями ты должен совладать гораздо лучше.»`;
		}
	}
}

let game = new Game();


window.onload = function() {
	game.startGame();
	document.querySelector("#stillLife").addEventListener("click",() => {game.clickOnButtons(); });
	document.querySelector("#stillLife_no").addEventListener("click",() => {game.clickOnButtons(); });
}