class SolarSystem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isActive = false;
        this.init();
    }

    init() {
        console.log('SolarSystem: Component initializing...');
        this.render();
        this.loadStyles();
        this.loadScripts();
        console.log('SolarSystem: Component initialized');
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -10;
                    opacity: 0.6;
                    transition: opacity 0.5s ease;
                    pointer-events: none;
                    background: transparent !important;
                }
                
                :host([active]) {
                    opacity: 0.8;
                }
                
                #solar-container {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    overflow: hidden;
                    background: radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
                }
                
                /* Solar System Styles */
                #universe {
                    z-index: 1;
                    position: absolute;
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                    background-position: center 40%;
                    background-repeat: no-repeat;
                    background-size: cover;
                }
                
                #galaxy {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                
                #solar-system {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                }
                
                .orbit {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    border: 2px solid rgba(255,255,255,.2);
                    border-radius: 50%;
                    transform-style: preserve-3d;
                    animation-name: orbit;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                }
                
                .orbit .orbit{ 
                    animation-name: suborbit; 
                }
                
                .pos {
                    position: absolute;
                    top: 50%;
                    width: 2em;
                    height: 2em; 
                    margin-top: -1em;
                    margin-left: -1em;
                    transform-style: preserve-3d;
                    animation-name: invert;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                }
                
                #sun, .planet, #earth .moon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 1em;
                    height: 1em; 
                    margin-top: -.5em;
                    margin-left: -.5em;
                    border-radius: 50%;
                    transform-style: preserve-3d;
                }
                
                #sun {
                    background: radial-gradient(circle at center, #FB7209 0%, #FF8C00 50%, #FF4500 100%);
                    background-repeat: no-repeat;
                    background-size: cover;
                    box-shadow: 0 0 60px rgba(255, 160, 60, .4);
                    width: 6em;
                    height: 6em;
                    margin-top: -3em;
                    margin-left: -3em;
                }
                
                .planet {
                    background-color: #202020;
                    background-repeat: no-repeat;
                    background-size: cover;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                    box-shadow: 0 0 10px rgba(255,255,255,0.1);
                    width: 3em;
                    height: 3em;
                    margin-top: -1.5em;
                    margin-left: -1.5em;
                }
                
                .ring{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    border-radius: 50%;
                }
                
                #saturn .ring {
                    width: 2em;
                    height: 2em;
                    margin-top: -1em;
                    margin-left: -1em;
                    border: 1px solid rgba(255,255,255,.3);
                    transform: rotateX(75deg);
                }
                
                /* Planet specific styles */
                #mercury .planet { background-color: #8C7853; box-shadow: 0 0 8px rgba(140, 120, 83, 0.6); }
                #venus .planet { background-color: #E6BE8A; box-shadow: 0 0 8px rgba(230, 190, 138, 0.6); }
                #earth .planet { background-color: #4B9CD3; box-shadow: 0 0 8px rgba(75, 156, 211, 0.6); }
                #mars .planet { background-color: #C1440E; box-shadow: 0 0 8px rgba(193, 68, 14, 0.6); }
                #jupiter .planet { background-color: #D8CA9D; box-shadow: 0 0 8px rgba(216, 202, 157, 0.6); }
                #saturn .planet { background-color: #FAD5A5; box-shadow: 0 0 8px rgba(250, 213, 165, 0.6); }
                #uranus .planet { background-color: #4FD0E7; box-shadow: 0 0 8px rgba(79, 208, 231, 0.6); }
                #neptune .planet { background-color: #4B70DD; box-shadow: 0 0 8px rgba(75, 112, 221, 0.6); }
                
                /* Orbit sizes - это критически важно! */
                #mercury {
                    width: 18em;
                    height: 18em;
                    margin-top: -9em;
                    margin-left: -9em;
                    animation-duration: 3s;
                }
                
                #venus {
                    width: 27em;
                    height: 27em;
                    margin-top: -13.5em;
                    margin-left: -13.5em;
                    animation-duration: 7s;
                }
                
                #earth {
                    width: 36em;
                    height: 36em;
                    margin-top: -18em;
                    margin-left: -18em;
                    animation-duration: 10s;
                }
                
                #mars {
                    width: 45em;
                    height: 45em;
                    margin-top: -22.5em;
                    margin-left: -22.5em;
                    animation-duration: 19s;
                }
                
                #jupiter {
                    width: 63em;
                    height: 63em;
                    margin-top: -31.5em;
                    margin-left: -31.5em;
                    animation-duration: 116s;
                }
                
                #saturn {
                    width: 81em;
                    height: 81em;
                    margin-top: -40.5em;
                    margin-left: -40.5em;
                    animation-duration: 285s;
                }
                
                #uranus {
                    width: 99em;
                    height: 99em;
                    margin-top: -49.5em;
                    margin-left: -49.5em;
                    animation-duration: 840s;
                }
                
                #neptune {
                    width: 117em;
                    height: 117em;
                    margin-top: -58.5em;
                    margin-left: -58.5em;
                    animation-duration: 1640s;
                }
                
                /* Animations */
                @keyframes orbit {
                    100% { transform: rotateZ(360deg); }
                }
                
                @keyframes suborbit {
                    100% { transform: rotateZ(-360deg); }
                }
                
                @keyframes invert {
                    100% { transform: rotateZ(-360deg); }
                }
                
                /* Speed variations */
                :host([speed="slow"]) #mercury { animation-duration: 6s; }
                :host([speed="slow"]) #venus { animation-duration: 14s; }
                :host([speed="slow"]) #earth { animation-duration: 20s; }
                :host([speed="slow"]) #mars { animation-duration: 38s; }
                :host([speed="slow"]) #jupiter { animation-duration: 232s; }
                :host([speed="slow"]) #saturn { animation-duration: 570s; }
                :host([speed="slow"]) #uranus { animation-duration: 1680s; }
                :host([speed="slow"]) #neptune { animation-duration: 3280s; }
                
                :host([speed="fast"]) #mercury { animation-duration: 1.5s; }
                :host([speed="fast"]) #venus { animation-duration: 3.5s; }
                :host([speed="fast"]) #earth { animation-duration: 5s; }
                :host([speed="fast"]) #mars { animation-duration: 9.5s; }
                :host([speed="fast"]) #jupiter { animation-duration: 58s; }
                :host([speed="fast"]) #saturn { animation-duration: 142.5s; }
                :host([speed="fast"]) #uranus { animation-duration: 420s; }
                :host([speed="fast"]) #neptune { animation-duration: 820s; }
                
                /* Responsive */
                @media (max-width: 768px) {
                    :host {
                        opacity: 0.4;
                    }
                    :host([active]) {
                        opacity: 0.6;
                    }
                    
                    /* Уменьшаем размеры на мобильных */
                    #mercury { width: 9em; height: 9em; margin-top: -4.5em; margin-left: -4.5em; }
                    #venus { width: 13.5em; height: 13.5em; margin-top: -6.75em; margin-left: -6.75em; }
                    #earth { width: 18em; height: 18em; margin-top: -9em; margin-left: -9em; }
                    #mars { width: 22.5em; height: 22.5em; margin-top: -11.25em; margin-left: -11.25em; }
                    #jupiter { width: 31.5em; height: 31.5em; margin-top: -15.75em; margin-left: -15.75em; }
                    #saturn { width: 40.5em; height: 40.5em; margin-top: -20.25em; margin-left: -20.25em; }
                    #uranus { width: 49.5em; height: 49.5em; margin-top: -24.75em; margin-left: -24.75em; }
                    #neptune { width: 58.5em; height: 58.5em; margin-top: -29.25em; margin-left: -29.25em; }
                }
                
                /* Performance optimizations */
                @media (prefers-reduced-motion: reduce) {
                    .orbit {
                        animation-play-state: paused;
                    }
                }

                .label {
                    position: absolute;
                    top: 2.5em; /* Position below the planet */
                    left: 50%;
                    transform: translateX(-50%);
                    color: white;
                    font-family: sans-serif;
                    font-size: 10px;
                    text-align: center;
                    white-space: nowrap;
                    background: rgba(0, 0, 0, 0.5);
                    padding: 3px 6px;
                    border-radius: 4px;
                    z-index: 10; /* Ensure label is on top */
                }

                .label .name {
                    font-weight: bold;
                    display: block;
                }

                .label .speed {
                    display: block;
                    font-size: 9px;
                    opacity: 0.7;
                }
            </style>
            
            <div id="solar-container">
                <div id="universe" class="scale-stretched">
                    <div id="galaxy">
                        <div id="solar-system" class="earth">
                            <div id="mercury" class="orbit">
                                <div class="pos">
                                    <div class="planet"></div>
                                    <div class="label"><span class="name">Mercury</span><span class="speed">3s</span></div>
                                </div>
                            </div>
                            <div id="venus" class="orbit">
                                <div class="pos">
                                    <div class="planet"></div>
                                    <div class="label"><span class="name">Venus</span><span class="speed">7s</span></div>
                                </div>
                            </div>
                            <div id="earth" class="orbit">
                                <div class="pos">
                                    <div class="orbit">
                                        <div class="pos">
                                            <div class="moon"></div>
                                        </div>
                                    </div>
                                    <div class="planet"></div>
                                    <div class="label"><span class="name">Earth</span><span class="speed">10s</span></div>
                                </div>
                            </div>
                            <div id="mars" class="orbit">
                                <div class="pos">
                                    <div class="planet"></div>
                                    <div class="label"><span class="name">Mars</span><span class="speed">19s</span></div>
                                </div>
                            </div>
                            <div id="jupiter" class="orbit">
                                <div class="pos">
                                    <div class="planet"></div>
                                    <div class="label"><span class="name">Jupiter</span><span class="speed">116s</span></div>
                                </div>
                            </div>
                            <div id="saturn" class="orbit">
                                <div class="pos">
                                    <div class="planet">
                                        <div class="ring"></div>
                                    </div>
                                    <div class="label"><span class="name">Saturn</span><span class="speed">285s</span></div>
                                </div>
                            </div>
                            <div id="uranus" class="orbit">
                                <div class="pos">
                                    <div class="planet"></div>
                                    <div class="label"><span class="name">Uranus</span><span class="speed">840s</span></div>
                                </div>
                            </div>
                            <div id="neptune" class="orbit">
                                <div class="pos">
                                    <div class="planet"></div>
                                    <div class="label"><span class="name">Neptune</span><span class="speed">1640s</span></div>
                                </div>
                            </div>
                            <div id="sun"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadStyles() {
        // Additional styles can be loaded here if needed
    }

    loadScripts() {
        // Initialize solar system animations
        setTimeout(() => {
            this.initAnimations();
        }, 1000);
    }

    initAnimations() {
        console.log('SolarSystem: Initializing animations...');
        try {
            const orbits = this.shadowRoot.querySelectorAll('.orbit');
            console.log('Found orbits:', orbits.length);
            
            orbits.forEach((orbit, index) => {
                const planet = orbit.querySelector('.planet');
                if (planet) {
                    console.log(`Planet ${index + 1} found:`, planet);
                }
            });
            
            this.startAnimations();
            console.log('SolarSystem: Animations started');
        } catch (error) {
            console.error('SolarSystem: Error initializing animations:', error);
        }
    }

    startAnimations() {
        console.log('SolarSystem: Starting animations...');
        try {
            const universe = this.shadowRoot.querySelector('#universe');
            const solarSystem = this.shadowRoot.querySelector('#solar-system');
            
            if (universe && solarSystem) {
                // Add animation classes
                universe.classList.add('scale-stretched', 'set-speed');
                solarSystem.classList.add('earth');
                console.log('SolarSystem: Animation classes added');
            } else {
                console.error('SolarSystem: Universe or solar system elements not found');
            }
        } catch (error) {
            console.error('SolarSystem: Error starting animations:', error);
        }
    }

    stopAnimations() {
        const orbits = this.shadowRoot.querySelectorAll('.orbit');
        orbits.forEach(orbit => {
            orbit.style.animationPlayState = 'paused';
        });
    }

    setActive(active) {
        this.isActive = active;
        if (active) {
            this.setAttribute('active', '');
            this.startAnimations();
        } else {
            this.removeAttribute('active');
            this.stopAnimations();
        }
    }

    

    
}

customElements.define('solar-system', SolarSystem); 