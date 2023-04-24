#Documentation : https://tetris.fandom.com/wiki/Playfield
https://tetris.fandom.com/wiki/Tetris_Guideline

The vast majority of tetromino based game use a playfield 10 cells wide and between 16 and 24 cells tall. Notable exceptions are the following:

Mode easy = every tetromino go down if the box is empty

Mode Normal = grid large 10 x 20

Class Tetromino :

I = Light Blue = line
0 = Yellow = square block
T = Purple = like a T
S = Green = bottom left to top right
Z = Red = top left to bottom right
j = Blue = 2 left then go right
l = Orange = 2 right then go left

[[2,0,0],
[2,2,2],
[0,0,0]]

Every piece come from the top in the middle

A tetromino is selected randomly and addes to a queue of 3 tetromino (displayed on the left) + the current tetromino

By clicking Up arrow => Rotate the piece clockwise

By presing space bar => all the tetromino goes directly down

When a line is complete destroy it

#Technical part :

create a limit en the right and the left part to be unable to loss the piece

Create a class tetromio

create each tetromino wich extend tetromino
have specific color
specific

doing a matrice

moving the tetromino It goes down every 500millisecond
maybe every 10lines => reduce this timeout

create an array of all tetromino => the random tetromino will be selected from there

create an array with the next 4 tetromino and display it on the right (maybe if difficulty selected is hard don't display it)

when a ligne is completed, take all square with a specific id and move them down

a tetrominio is a div with a speciif id with apply a specifi class and then specific style

add a compter to make sure the tetromino come at least every 12

The hold function (){
check if there is already a tetromino stored{
if yes, then make the currentTetromino = storedTetromino
}else {
storedTetromino = currentTetromino
currentTetromino = nextTetromino
}
}

make the value of "nextTetromino" always equal to storedTetromino[0]

#BONUS :

rotation contre le mur

Clicking H => hold the current piece

Every minute create a block line to move everything up
If tetromino touch a zone, don't block everything, syle allow the piece to rotate, lauchn de 10second timer

Adding an order of priority with tetromino, some are harder to play than other

Stack truncation : allowing piece to go above the grid

Adding : "Poly"-mino which is sqaure of 3x3 or more

Difficulties :

Wallkick => how to manage rotation
