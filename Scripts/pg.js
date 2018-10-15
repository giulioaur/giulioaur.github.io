var pgs = {
    list : [
        {
            avatar : "Styles\\Images\\me.jpg",
            name : "Giulio Auriemma Mazzoccola",
            race : "Human",
            spec : "Programmer",
            background: "Styles/Images/mybackground.jpg",
            statistics : [10, 16, 8, 18, 12, 16],
            equips : { 
                helmet: { src: "Styles/Images/pgs/beard.png", descr: "There is nothing cooler than a great and clan beard." },
                right_hand: { src: "Styles/Images/pgs/keyboard.png", descr: "Essential to write code." },
                left_hand: { src: "Styles/Images/pgs/mouse.png", descr: "If you are not a master geek, without this is impossible to work." },
                body: { src: "Styles/Images/pgs/t-shirt.png", descr: "Funny t-shirt makes people happy." },
                legs: { src: "Styles/Images/pgs/shorts.png", descr: "Fresh and full of pockets for every occasion." },
                foot: { src: "Styles/Images/pgs/flip-flops.png", descr: "They let your feet breath and are extremely comfortable." }
            },
            // Max 20 items.
            inventory : [
                { src: "Styles/Images/pgs/beard.png", descr: "There is nothing cooler than a great and clan beard." },
                { src: "Styles/Images/pgs/keyboard.png", descr: "Essential to write code." },
                { src: "Styles/Images/pgs/mouse.png", descr: "If you are not a master geek, without this is impossible to work." },
                { src: "Styles/Images/pgs/t-shirt.png", descr: "Funny t-shirt makes people happy." },
                { src: "Styles/Images/pgs/shorts.png", descr: "Fresh and full of pockets for every occasion." },
                { src: "Styles/Images/pgs/flip-flops.png", descr: "They let your feet breath and are extremely comfortable." }
            ],
            // Max 5 categories.
            talentCategories: [
                {
                    name: "Teamwork",
                    // Max 4 talents.
                    talents: [
                        {
                            name: "Agile development",
                            image: "Styles/Images/pgs/beard.png",
                            description: "Knowledge of the Agile software development methodology."
                        },
                        {
                            name: "Communication",
                            image: "Styles/Images/pgs/keyboard.png",
                            description: "Good communication skills."
                        }
                    ]
                },
                {
                    name: "Design",
                    // Max 4 talents.
                    talents: [
                        {
                            name: "Design Pattern",
                            image: "Styles/Images/pgs/t-shirt.png",
                            description: "Knowledge and capacity of using the most famous software design pattern. Knowledge of game \
                                          design pattern like data locality and object pooling. Knowledge of parallel design patter."
                        }
                    ]
                }
            ],
            abilities: [
                {
                    icon: "Styles/Images/pgs/t-shirt.png",
                    shortcut: "Q",
                    code:  
`\\NODEC[0]include<stdio.h>
\\NODEC[13]include<iostream> 
\\NODEC[1]
int main (int argc, char** argv){\\NODEC[2]
    char *tmp = "hello world"\\NODEC[8];\\NODEC[3]
    printf("%s", *tmp);\\NODEC[15]
    cout << "hello world!" << endl;\\NODEC[4]
}
\\NODET[5]> g++ main.cpp -o main
\\NODEI[6]> main.cpp:17:5: error: expected ';' before printf
\\NODEP[7][800]
\\NODET[9]> g++ main.cpp -o main
> \\main
\\NODEI[10]> Segmentation Fault
\\NODEP[11][1600]
\\NODED[12][0]
\\NODED[14][2,8,3]
\\NODET[16]> g++ main.cpp -o main
> \\main
\\NODEI[17]> hello world`
                           
                }
            ]
        }
        // {
        //     avatar : "Styles\\Images\\me.jpg",
        //     name : "Sushi",
        //     race : "Polymorph",
        //     spec: "Gamer",
        //     background: "Styles/Images/sushi_bg.jpg",
        // }
    ]
}