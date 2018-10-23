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
                helmet: { src: "Styles/Images/pgs/Giulio/beard.png", descr: "There is nothing cooler than a great and clan beard." },
                right_hand: { src: "Styles/Images/pgs/Giulio/keyboard.png", descr: "Essential to write code." },
                left_hand: { src: "Styles/Images/pgs/Giulio/mouse.png", descr: "If you are not a master geek, without this is impossible to work." },
                body: { src: "Styles/Images/pgs/Giulio/t-shirt.png", descr: "Funny t-shirt makes people happy." },
                legs: { src: "Styles/Images/pgs/Giulio/shorts.png", descr: "Fresh and full of pockets for every occasion." },
                foot: { src: "Styles/Images/pgs/Giulio/flip-flops.png", descr: "They let your feet breath and are extremely comfortable." }
            },
            // Max 20 items.
            inventory: [
                { src: "Styles/Images/pgs/Giulio/so-logo.jpg", descr: "Basic survival kit for a programmer." },
                { src: "Styles/icons/git/git-original.svg", descr: "Solid alternative to a folder full of copies of the same file with different names." },
                { src: "Styles/Images/pgs/Giulio/paw-heart.png", descr: "Indeed your best friend." },
                { src: "Styles/Images/pgs/Giulio/kimono.png", descr: "A noble garment for a noble art." }

            ],
            // Max 5 categories.
            talentCategories: [
                {
                    name: "Teamwork",
                    // Max 4 talents.
                    talents: [
                        {
                            name: "Agile development",
                            image: "Styles/Images/pgs/Giulio/ink-swirl.png",
                            description: "You know how to move in a group that use AGILE development methodologies."
                        },
                        {
                            name: "Communication",
                            image: "Styles/Images/pgs/Giulio/conversation.png",
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
                            image: "Styles/Images/pgs/Giulio/family-tree.png",
                            description: "Your programs use optimized algorithms and data structures to raise their performances. "
                        },
                        {
                            name: "Design Pattern",
                            image: "Styles/Images/pgs/Giulio/direction-sign.png",
                            description: "[Passive] Your program will be no more a mess of code. Now you know techniques to make \
                                            your programs efficient and understandable."
                        },
                        {
                            name: "Design Pattern 2",
                            image: "Styles/Images/pgs/Giulio/direction-signs.png",
                            description: "[Passive] Now you also know new fabulous design patterns to apply on the development \
                                            of games and parallel applications."
                        },
                        {
                            name: "Documentation",
                            image: "Styles/Images/pgs/Giulio/book-cover.png",
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
                            image: "Styles/Images/pgs/Giulio/divert.png",
                            description: "Speeds up the assigned task exploiting multithreading and parallelization. Be careful in using \
                                            this abilities, since it could easily led to subtle problems. "
                        },
                        {
                            name: "Client-Server",
                            image: "Styles/Images/pgs/Giulio/satellite-communication.png",
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
                            image: "Styles/Images/pgs/Giulio/water-drop.png",
                            description: "Puts the foundation for every kind of program."
                        },
                        {
                            name: "Geometry",
                            image: "Styles/Images/pgs/Giulio/divided-square.png",
                            description: "[Passive] Knowledge of the basis of the 3D-related geometry."
                        },
                        {
                            name: "Collision Detection",
                            image: "Styles/Images/pgs/Giulio/striking-balls.png",
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
                            image: "Styles/Images/pgs/Giulio/ram.png",
                            description: "Your programs make a smart use of the memory's resources. They are faster and suitable for \
                                            different kind of hardware."
                        },
                        {
                            name: "Multi-platform",
                            image: "Styles/Images/pgs/Giulio/platform.png",
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
                    icon: "Styles/Images/pgs/Giulio/unity.png",
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
                    icon: "Styles/Images/pgs/Giulio/unreal.png",
                    shortcut: "1",
                    code:
`\\NODEC[0]void AMyActor::BeginPlay() {
	Super::BeginPlay();
	
	UStaticMeshComponent* mesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Cube Mesh"));
	this->SetRootComponent(mesh);

}
\\NODEI[1]> Compiling Unreal...
\\NODEP[2][2000]
\\NODEE[3]$('<img id="unreal_crash" src="Styles/Images/pgs/Giulio/ue4_crash_screen.png" />')
        .css({ 'position': 'absolute', 'width': '60vw', 'height': '30vw', 'background-color': 'white', 'right': '20vw', 'top': '10vw', 'z-index': '2000', 'cursor': 'wait' })
        .appendTo($('body'))
        setTimeout(() => { $('#unreal_crash').remove()}, 3000);`
                }
            ]
        },
        {
            avatar: "Styles/Images/pgs/Sushi/Sushi.png",
            name : "Dr Sushi",
            race : "Polymorph",
            spec: "Gamer",
            background: "Styles/Images/sushi_bg.jpg", 
            statistics: [8, 12, 16, 16, 10, 18],
            equips: {
                helmet: { src: "Styles/Images/pgs/Sushi/pink-knight-helm.png", descr: "Give you the ability to throw rainbows." },
                right_hand: { src: "Styles/Images/pgs/Sushi/famas.png", descr: "If a man with a sword and a men with a gun challenge each other, I want to be the one with a Famas." },
                left_hand: { src: "Styles/Images/pgs/Sushi/relic-blade.png", descr: "Nothing better than cut your enemies head with your shiny legendary blade." },
                body: { src: "Styles/Images/pgs/Sushi/robe.png", descr: "A robe donated by my master that is not a vampire." },
                legs: { src: "Styles/Images/pgs/Sushi/pan.png", descr: "It protects you from bullets." },
                foot: { src: "Styles/Images/pgs/Sushi/walking-boot.png", descr: "Because you definitevely need it unless you are a Gorgon." }
            },
            // Max 20 items.
            inventory: [
                { src: "Styles/Images/pgs/Sushi/shiny-apple.png", descr: "Give it to spinning bandicoot." },
                { src: "Styles/Images/pgs/Sushi/warp-pipe.png", descr: "MAMMA MIA!" },
                { src: "Styles/Images/pgs/Sushi/companion-cube.png", descr: "Your best friend." },
                { src: "Styles/Images/pgs/Sushi/spanner.png", descr: "You always need a reserve weapon." },
                { src: "Styles/Images/pgs/Sushi/ring.png", descr: "Wear it to become invisible." },
                { src: "Styles/Images/pgs/Sushi/mono-wheel-robot.png", descr: "Directive one: Protect humanity! \nDirective two: Obey Sushi at all costs. \nDirective three: Dance!." },
                { src: "Styles/Images/pgs/Sushi/war-pick.png", descr: "Useful to destroy the surrounding environment and drop cube of material from it." },
                { src: "Styles/Images/pgs/Sushi/lightsaber.png", descr: "Elegant weapon for a more civilized age." },
                { src: "Styles/Images/pgs/Sushi/big-egg.png", descr: "Obtained after having charged a tiny hooded man." }

            ],
        // Max 5 categories.
        talentCategories: [
            {
                name: "Multiplayer",
                // Max 4 talents.
                talents: [
                    {
                        name: "Gold cap",
                        image: "Styles/Images/pgs/Sushi/gold-bar.png",
                        description: "No matter how much you try, you will never go over gold league."
                    },
                    {
                        name: "Lag",
                        image: "Styles/Images/pgs/Sushi/dodging.png",
                        description: "Give you a way out for your bad performance."
                    },
                    {
                        name: "Bad Teammates",
                        image: "Styles/Images/pgs/Sushi/three-friends.png",
                        description: "Increase the chance to be matched with bad and toxic team. If you are matched with a good team, \
                                        increase the chance to become the element that ruins the match."
                    }
                ]
            },
            {
                name: "RPG",
                // Max 4 talents.
                talents: [
                    {
                        name: "FOR THE HORDE!",
                        image: "Styles/Images/pgs/Sushi/horde.png",
                        description: "You fight side by side with the Dark Lady, even though you have a secret love for Dwarfs and their fantastic beer."
                    },
                    {
                        name: "Mount Call",
                        image: "Styles/Images/pgs/Sushi/wolf.png",
                        description: "Whistle to summon your mount in funny unattainable places."
                    },
                    {
                        name: "Esper",
                        image: "Styles/Images/pgs/Sushi/croc-sword.png",
                        description: "Now you have the ability to summon new companions to help you in the fight."
                    },
                    {
                        name: "FUS-RO-DAH",
                        image: "Styles/Images/pgs/Sushi/sky_drake.png",
                        description: "Use the immense power of your scream to shoot a devastating wave of sound that blows up all in front of you."
                    }
                ]
            },
            {
                name: "FPS",
                // Max 4 talents.
                talents: [
                    {
                        name: "Smoke mask",
                        image: "Styles/Images/pgs/Sushi/gas-mask.png",
                        description: "Increase your resistance against gas's attack."
                    },
                    {
                        name: "Bad Aim",
                        image: "Styles/Images/pgs/Sushi/police-target.png",
                        description: "The probability of missing your enemy, especially in critical situation, is now very high."
                    },
                    {
                        name: "Still not dead",
                        image: "Styles/Images/pgs/Sushi/shambling-zombie.png",
                        description: "Increase your damages against undeads while holding a firearm. "
                    }
                ]
            },
            {
                name: "Action",
                // Max 4 talents.
                talents: [
                    {
                        name: "Navi",
                        image: "Styles/Images/pgs/Sushi/fairy.png",
                        description: "A fairy that continuously follows you, helping you every time you have to use your brain instead of your sword."
                    },
                    {
                        name: "DANCE!!",
                        image: "Styles/Images/pgs/Sushi/dancing.png",
                        description: "After you kill your enemy, you start dancing on his corpse. You can choose among several different types\
                                        of dances."
                    },
                    {
                        name: "Train follower",
                        image: "Styles/Images/pgs/Sushi/subway.png",
                        description: "Now you are able to follow that damn train!"
                    }
                ]
            },
            {
                name: "Other",
                // Max 4 talents.
                talents: [
                    {
                        name: "Random Combo",
                        image: "Styles/Images/pgs/Sushi/gamepad-cross.png",
                        description: "Press some random keys on your gamepad to do awesome combos. The harder and faster you press the strongest they will be."
                    },
                    {
                        name: "Malista",
                        image: "Styles/Images/pgs/Sushi/greek-temple.png",
                        description: "You have the ability to gather tons of resources and end up doing nothing but losing."
                    }
                ]
            }
        ],
        abilities: [
            {
                icon: "Styles/Images/pgs/Sushi/fireball.png",
                shortcut: "Q",
                code:
`\\NODEM[1][600]
\\NODEC[0]FIREEEEEEEEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL
\\NODEH[2][-1000]
\\NODEE[3]spawner.shootAll();
\\NODEI[4]You hit every hittable thing, included yourself.`
            },
            {
                icon: "Styles/Images/pgs/Sushi/healing.png",
                shortcut: "W",
                code:
`\\NODEM[1][200]
\\NODEC[0]Energia
\\NODEH[2][300]`
            },
            {
                icon: "Styles/Images/pgs/Sushi/reticule.png",
                shortcut: "E",
                code:
`\\NODEE[0]
if (spawner.shoot())
    $('#code_terminal .node_father').append($('<span>NICE AIM!</span>'));
else
    $('#code_terminal .node_father').append($('<span>[Sarcasm ON] NICE AIM![Sarcasm OFF]</span>'));`
            },
            {
                icon: "Styles/Images/pgs/Sushi/goblin-camp.png",
                shortcut: "R",
                code:
`\\NODEE[0]
try{
for (let i = 0; i < 100 && !spawner.spawn(Math.floor(Math.random() * Math.floor(spawner._width)), Math.floor(Math.random() * Math.floor(spawner._height))); ++i) ;
}catch(error){

}

\\NODEI[0]A goblin has spawn!
\\NODEI[1]However, what do you expect from shaking a goblin's tent? Candies?
\\NODEI[2]Try shoot them with your E!`
            }
        ]
        }
    ]
}