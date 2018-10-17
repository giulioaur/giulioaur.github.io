var pgs = {
    list : [
        {
            avatar : "Styles\\Images\\me.jpg",
            name : "Giulio Auriemma Mazzoccola",
            race : "Human",
            spec : "Programmer",
            background: "Styles/Images/mybackground.jpg",
            statistics : [10, 14, 8, 18, 12, 16],
            equips : { 
                helmet: { src: "Styles/Images/pgs/beard.png", descr: "There is nothing cooler than a great and clan beard." },
                right_hand: { src: "Styles/Images/pgs/keyboard.png", descr: "Essential to write code." },
                left_hand: { src: "Styles/Images/pgs/mouse.png", descr: "If you are not a master geek, without this is impossible to work." },
                body: { src: "Styles/Images/pgs/t-shirt.png", descr: "Funny t-shirt makes people happy." },
                legs: { src: "Styles/Images/pgs/shorts.png", descr: "Fresh and full of pockets for every occasion." },
                foot: { src: "Styles/Images/pgs/flip-flops.png", descr: "They let your feet breath and are extremely comfortable." }
            },
            // Max 20 items.
            inventory: [
                { src: "Styles/Images/pgs/so-logo.jpg", descr: "Basic survival kit for a programmer." },
                { src: "Styles/icons/git/git-original.svg", descr: "Solid alternative to a folder full of copies of the same file with different names." },
                { src: "Styles/Images/pgs/paw-heart.png", descr: "Indeed your best friend." },
                { src: "Styles/Images/pgs/kimono.png", descr: "A noble garment for a noble art." }

            ],
            // Max 5 categories.
            talentCategories: [
                {
                    name: "Teamwork",
                    // Max 4 talents.
                    talents: [
                        {
                            name: "Agile development",
                            image: "Styles/Images/pgs/ink-swirl.png",
                            description: "You know how to move in a group that use AGILE development methodologies."
                        },
                        {
                            name: "Communication",
                            image: "Styles/Images/pgs/conversation.png",
                            description: "[Charisma Bonus] You are nice. Thanks to this quality you are not going to have too \
                                            much problems in inserting in an heterogeneous group."
                        }
                    ]
                },
                {
                    name: "Development",
                    // Max 4 talents.
                    talents: [
                        {
                            name: "Algorithms & Data Structures",
                            image: "Styles/Images/pgs/family-tree.png",
                            description: "Your programs use optimized algorithms and data structures to raise their performances. "
                        },
                        {
                            name: "Design Pattern",
                            image: "Styles/Images/pgs/direction-sign.png",
                            description: "[Passive] Your program will be no more a mess of code. Now you know techniques to make \
                                            your programs efficient and understandable."
                        },
                        {
                            name: "Design Pattern 2",
                            image: "Styles/Images/pgs/direction-signs.png",
                            description: "[Passive] Now you also know new fabulous design patterns to apply on the development \
                                            of games and parallel applications."
                        },
                        {
                            name: "Documentation",
                            image: "Styles/Images/pgs/book-cover.png",
                            description: "Activate to create a clear and understandable documentation of your code, made by both \
                                            comments on source and standalone files. Leave active to document code run-time."
                        }
                    ]
                },
                {
                    name: "Architecture",
                    // Max 4 talents.
                    talents: [
                        {
                            name: "Parallel",
                            image: "Styles/Images/pgs/divert.png",
                            description: "Speeds up the assigned task exploiting multithreading and parallelization. Be careful in using \
                                            this abilities, since it could easily led to subtle problems. "
                        },
                        {
                            name: "Client-Server",
                            image: "Styles/Images/pgs/satellite-communication.png",
                            description: "You can now develop programs that exploits the client-server paradigm. Thanks to this talent \
                                            you can handle situation like multiplayer games."
                        }
                    ]
                },
                {
                    name: "2D / 3D",
                    // Max 4 talents.
                    talents: [
                        {
                            name: "Math",
                            image: "Styles/Images/pgs/water-drop.png",
                            description: "Puts the foundation for every kind of program."
                        },
                        {
                            name: "Geometry",
                            image: "Styles/Images/pgs/divided-square.png",
                            description: "[Passive] Knowledge of the basis of the 3D-related geometry."
                        },
                        {
                            name: "Collision Detection",
                            image: "Styles/Images/pgs/striking-balls.png",
                            description: "Use this talents when shooting. Your bullets now have 100% probability to hit the target."
                        }
                    ]
                },
                {
                    name: "Optimization",
                    // Max 4 talents.
                    talents: [
                        {
                            name: "Memory Management",
                            image: "Styles/Images/pgs/ram.png",
                            description: "Your programs make a smart use of the memory's resources. They are faster and suitable for \
                                            different kind of hardware."
                        },
                        {
                            name: "Multi-platform",
                            image: "Styles/Images/pgs/platform.png",
                            description: "Your programs make a smart use of the memory's resources. They are faster and suitable for \
                                            different kind of hardware."
                        }
                    ]
                }
            ],
            abilities: [
                {
                    icon: "Styles/icons/cplusplus/cplusplus-original.svg",
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
                },
                {
                    icon: "Styles/icons/java/java-original.svg",
                    shortcut: "W",
                    code:
`\\NODEC[9]public class HelloWorld {
    public static void main(String[] args) { 
\\NODEC[0]int main(String[] args){
\\NODEC[10]    \\NODEC[1]    String tmp = "Hello world";
\\NODEC[11]    \\NODEC[2]    System.out.println(tmp);
\\NODEC[12]    }
\\NODEC[3]}
\\NODET[4]> javac HelloWorld.java
\\NODEP[5][500]
\\NODET[6]> java HelloWorld
\\NODEI[7]> Error: Could not find or load main class undefined
\\NODED[8][0]
\\NODET[13]> javac HelloWorld.java
\\NODEP[14][500]
\\NODET[15]> java HelloWorld
\\NODEI[16]> Hello world!`
                },
                {
                    icon: "Styles/icons/csharp/csharp-original.svg",
                    shortcut: "E",
                    code:
`\\NODEC[0]using System;

class Program {
    static void Main(string[] args) {
        Console.WriteLine(Math.Round(1.5)+Math.Round(2.5));
    }
}
\\NODET[1]> csc -out:helloWorld.exe helloWorld.cs
\\NODEP[2][300]
\\NODET[3]> helloWorld.exe
\\NODEI[4]> 4`
                },
                {
                    icon: "Styles/icons/javascript/javascript-original.svg",
                    shortcut: "R",
                    code:
`\\NODEC[0]alert('Hello world!')
\\NODEE[1]alert('Hello world!')`
                },
                {
                    icon: "Styles/Images/pgs/unity.png",
                    shortcut: "T",
                    code:
`\\NODEC[0]using UnityEngine;

public class HelloWorld : MonoBehaviour {
	void Start () {
		gameObject.AddComponent<Rigidbody>();
	}
}
\\NODEP[1][700]
\\NODEE[2]$('<div id="unity_cube"></div>')
        .css({'position': 'absolute', 'width': '5vw', 'height': '5vw', 'background-color': 'white', 'right': '47.5vw', 'top': '0', 'z-index': '2000'})
        .appendTo($('body'))
        .animate({'top' : '100vh'}, 1400, () => { $('#unity_cube').remove(); });`
                },
                {
                    icon: "Styles/Images/pgs/unreal.png",
                    shortcut: "1",
                    code:
`\\NODEC[0]void AMyActor::BeginPlay() {
	Super::BeginPlay();
	
	UStaticMeshComponent* mesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Cube Mesh"));
	this->SetRootComponent(mesh);

}
\\NODEI[1]> Compiling Unreal...
\\NODEP[2][2000]
\\NODEE[3]$('<img id="unreal_crash" src="Styles/Images/pgs/ue4_crash_screen.png" />')
        .css({ 'position': 'absolute', 'width': '60vw', 'height': '30vw', 'background-color': 'white', 'right': '20vw', 'top': '10vw', 'z-index': '2000', 'cursor': 'wait' })
        .appendTo($('body'))
        setTimeout(() => { $('#unreal_crash').remove()}, 3000);`
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