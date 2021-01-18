import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import './App.css';
import {Canvas3D, ReactWebPluginService} from '@twikit/react-twikit-web-plugin';
import {combineLatest} from "rxjs";

export const TwikbotContext = createContext(new ReactWebPluginService('https://sites.twikit.com/AutoDemo/production-2020-12-23-165832114/plugin-script.js'));

function App() {
    // Create reference to a DIV-element
    const canvasRef = useRef<HTMLDivElement>(null);

    // Using a state to store the HTML created by the plugin
    const [myParameters, setMyParameters] = useState(null);

    // Using the TwikbotContext
    const twikbotService: any = useContext(TwikbotContext);

    // The Twikit product key
    const productKey: string = 'wheel';

    useEffect(() => {
        // Starting the configurator with the productKey and the reference
        twikbotService.startConfigurator(productKey, canvasRef.current);

        // Waiting for the Parameters to be ready and for the twikbotService to be loaded
        combineLatest([twikbotService.parametersData$, twikbotService.loaded$]).subscribe(([parameters]) => {
            // setting the state with the default parameters created by Twikbot Service
            setMyParameters(twikbotService.loadParameters(parameters, twikbotService));
        });

        return () => {
            // Stopping configuration
            twikbotService.stopCurrentConfigurator();
        }
    }, [twikbotService]);

    // Using Canvas3D component provided by the plugin and inserting the parametersHtml
    return (
        <div className="App">
            <div className={'twikit-body'}>
                <Canvas3D canvasRef={canvasRef}/>
                <div className={'twikit-parameters'}>
                    {myParameters}
                </div>
            </div>
        </div>
    );
}

export default App;
