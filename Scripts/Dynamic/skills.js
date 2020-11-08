GLOBALS.skills = [
    // PROGRAMMING
    [
        {
            name: 'Cpp',
            svg: `
                <path fill="#D26383"
                    d="M115.4 30.7l-48.3-27.8c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z">
                </path>
                <path fill="#9C033A"
                    d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4v-55.7c0-.9-.1-1.9-.6-2.8l-106.6 62z">
                </path>
                <path fill="#fff"
                    d="M85.3 76.1c-4.2 7.4-12.2 12.4-21.3 12.4-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6z">
                </path>
                <path
                    d="M82.1 61.8h5.2v-5.3h4.4v5.3h5.3v4.4h-5.3v5.2h-4.4v-5.2h-5.2v-4.4zM100.6 61.8h5.2v-5.3h4.4v5.3h5.3v4.4h-5.3v5.2h-4.4v-5.2h-5.2v-4.4z">
                </path>
            `,
            level: 'gold',
            description: `My main languages, the one I have studied the most and I work with everyday. I really like its versatility and its power, 
            that allows you to basically make everything you want (sometimes with a big effort). Altough every time I find something new about it I feel
            like an astronomer looking the universe: lost in its immense vastity. Still a lot to be learn, but during years I have used mostly of its 
            most famous library and tools: stdlib, OpenMP, OpenCV, OpenGL, glmath, boost and cmake to name a few (I kinda like open source).`
        },
        {
            name: 'Java / CSharp',
            svg: `
                <path fill="#0074BD"
                    d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zM44.629 84.455s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z">
                </path>
                <path fill="#EA2D2E"
                    d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z">
                </path>
                <path fill="#0074BD"
                    d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zM90.609 93.041c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z">
                </path>
                <path fill="#EA2D2E"
                    d="M76.491 1.587s12.968 12.976-12.303 32.923c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815 8.548-12.834 32.229-19.059 26.998-39.667z">
                </path>
                <path fill="#0074BD"
                    d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z">
                </path>
            `,
            level: 'silver',
            description: `The pure object-oriented language I have used the most is Java, mainly for cs courses though. 
            Thanks to its simplicity I have quickly developed some desktop application (yeah, obliviously among them, one was for accessing a db) and 
            also a couple of web application. <br />My knowledge of C#, instead, is limited to the Unity engine framework, since all the experience with the
            Microsoft's language I have has been gained among caroutins, Update() and Components.`
        },
        {
            name: 'Web languages',
            svg: `
                <path fill="#F0DB4F" d="M1.408 1.408h125.184v125.185h-125.184z"></path>
                <path fill="#323330"
                    d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zm-46.885-37.793h-11.709l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z">
                </path>
            `,
            level: 'silver',
            description: `Indeed Javascript is one of the language I enjoy the most thanks to its madness (remember that 'NaN === NaN' is false). 
            Jokes aside, I really like javascript for allowing you to make with relatively simplicity things that in other languages are absurdly complex
            (full reflection *cof*cof*). But I am one of those bad persons that use it mostly as it was an imperative / oo language, really sorry. 
            I have also played a bit also with its brothers (Angular and Node), but I found them sometimes unnecessary complex. BTW, I have put Web language
            in the title just because I wanted to include also html and css, but came on! They are not real languages!`
        },
        {
            name: 'Python',
            svg: `
                <path fill="#306998"
                    d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137h-33.961c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491v-11.282c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548v-23.513c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zm-13.354 7.569c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z">
                </path>
                <path fill="#FFD43B"
                    d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655h-24.665c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412h-24.664v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zm-13.873 59.547c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z">
                </path>
            `,
            level: 'copper',
            description: `Put this here just to remember myself that one day I should definitely learn it better.`
        }
    ],
    // TOOLS
    [
        {
            name: 'Game engines',
            icon: 'class="icomoon icomoon-unrealengine"',
            level: 'silver',
            description: `Unity, Unreal and Apex, this is the list of the engine I have used so far, but I hope this become bigger and bigger since I 
            really love to discover how every engine has its peculiar approach to that problem. And maybe, one day, I will be also able (and not-lazy 
            enough) to write my small cute engine. I really love the world of engine programming, with all its awesome trick to spill every single frame 
            from the hardware. Optimization, low-level code and fancy algorithms are some of the stuff I love more about programming.`
        },
        {
            name: 'Versioning',
            svg: `
                <path fill="#F34F29"
                    d="M124.737 58.378l-55.116-55.114c-3.172-3.174-8.32-3.174-11.497 0l-11.444 11.446 14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679-3.78 3.78-9.901 3.78-13.683 0-2.842-2.844-3.545-7.019-2.105-10.521l-13.048-13.048-.002 34.341c.922.455 1.791 1.063 2.559 1.828 3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683.934-.933 2.014-1.638 3.167-2.11v-34.659c-1.153-.472-2.231-1.172-3.167-2.111-2.862-2.86-3.551-7.06-2.083-10.576l-14.313-14.313-37.792 37.79c-3.175 3.177-3.175 8.325 0 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858c3.174-3.176 3.174-8.327-.001-11.501z">
                </path>
            `,
            level: 'bronze',
            description: `Do I really have to add something to that? The main tool in every programmer's toolbox. Is it more the time I gain using it
            or the one I spent trying to merge conflicting files, who knows (at least with git)? I mainly use git for my own projects and Perforce in 
            production environment.`
        },
        {
            name: 'Visual Studio',
            svg: `
                <path fill="#800080"
                    d="M95 2.3l30.5 12.3v98.7L94.8 125.7 45.8 77l-31 24.1L2.5 94.9V33.1l12.3-5.9 31 24.3ZM14.8 45.7V83.2l18.5-19Zm48.1 18.5L94.8 89.3V39Z">
                </path>
            `,
            level: 'silver',
            description: `The one to rule the all. Seriously, since I discover the Visual Studio suits (both in its "standard" and "code" edition), I have
            never used any other developing environment; mostly because I really think that it has everything a developer needs, and even when it does not 
            have something, someone has already written an extension for it (thank you, mr. stranger).`
        }
    ],
    // KNOWLEDGE
    [
        {
            name: 'Documentation',
            icon: 'class="oi" data-glyph="document"',
            level: 'gold',
            description: `I'm one of that boring programmer that tries to have everything well documented, even my personal-only projects. I really
                feel that this not only helps me to came back to work on my old project if I ever need it, but also allow me to have a clear idea of 
                where I am and where I am going. And also, I love to read well written documentation (do you understand, Unreal?), so kudos to it!`
        },
        {
            name: 'Other fantastic skills',
            img: 'Styles/Images/Pusheen.png',
            level: 'platinum',
            description: `This is the part in a curriculum when you write amazing stuff like "I am like the most team player of the universe" or "great
            soft skills ability" whatever they means. But I prefer just to put a photo of pusheen, show the platinum medal, really different from the 
            silver one (accordingly to its color code, so if you cannot see it, time to upgrade your monitor) and say the I love the pink and cute stuff 
            like puppy, unicorn and dragon. And I think Ready Player One and Episode IX are really enjoyable movies.`
        },
        {
            name: 'Game ability',
            icon: 'class="icomoon icomoon-game-controller"',
            iconContent: `<span class="path1"></span><span
                            class="path2"></span><span class="path3"></span><span class="path4"></span><span
                            class="path5"></span><span class="path6"></span><span class="path7"></span><span
                            class="path8"></span><span class="path9"></span><span
                            class="path10"></span><span class="path11"></span><span
                            class="path12"></span><span class="path13"></span><span
                            class="path14"></span><span class="path15"></span><span
                            class="path16"></span><span class="path17"></span><span
                            class="path18"></span>`,
            level: 'silver',
            description: `I am the typical silver player: not an outstanding one but neither one of the worst, mostly because I try to enojoy the game,
            not being toxic and taking defeat easy. But my skills are also the same of a DL agent after just few thousand of cycles, so gg thelegend27. 
            Generelly I always go for the last but one difficulty in a game, allowing me to enjoy the experience while having a not so impossible challange.
            Although I am not a platinum-seeker player, but more an enojoy-the-ride player. `
        }
    ]
]