import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { clearInterval } from "timers";

export class UselessPhone implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _outputValue: string | null;
    private _defaultValue: string | null;

    private _isReadOnly: boolean;
    private _isVisible: boolean;

    private _selectInput: HTMLInputElement;
    private _container: HTMLDivElement;

    private phoneHead: HTMLSelectElement;
    private phoneCore: HTMLLabelElement;
    private buttonGuess: HTMLButtonElement;

    //private _context: ComponentFramework.Context<IInputs>;
    //private _notifyOutputChanged: () => void;

	/**
	 * Empty constructor.
	 */
	constructor() {}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        // Add control initialization code        
        this._defaultValue = ''; //context.parameters.ToggleAttribute.attributes ?.DefaultValue;

        let curentInputData = context.parameters.PhoneAttribute.raw;

        if (curentInputData != null) {
            this._outputValue = curentInputData;
        }
        else {
            this._outputValue = this._defaultValue;
        }

        this._isReadOnly = context.mode.isControlDisabled;
        this._isVisible = context.mode.isVisible;

        this._container = document.createElement("div");

        this.phoneHead = document.createElement("select");
        this.phoneHead.classList.add('selectElement');
        this.phoneHead.id = 'phoneHead';

        var phoneHeadCode = "";
        for (var i = 0; i < 100; i++) {
            phoneHeadCode = "+" + i.toString().padStart(2, '0');
            var phoneHeadOption = document.createElement('option');
            phoneHeadOption.value = phoneHeadCode;
            phoneHeadOption.innerHTML = phoneHeadCode;
            this.phoneHead.options.add(phoneHeadOption);
        }

        this.phoneHead.addEventListener('change', (event) => {
            this._outputValue = this.phoneHead.value + this.phoneCore.textContent;
            notifyOutputChanged();

        })
        

        this.phoneCore = document.createElement("label");
        this.phoneCore.textContent = context.parameters.PhoneAttribute.raw;
        this.phoneCore.textContent = "0000000000";
        this.phoneCore.id = "phoneCore";
        
        this.buttonGuess = document.createElement('button');
        this.buttonGuess.type = "button";
        this.buttonGuess.id = 'buttonGuess';
        this.buttonGuess.textContent = "I'm Feeling Lucky";
        this.buttonGuess.addEventListener('click', (event) => {
            let num: number = Math.round(Math.random() * 10000000000);
            let stringNumber = num.toString();
            if (stringNumber.length < 10) {
                for (let i = 0; i < 10 - stringNumber.length; i++) {
                    stringNumber = '0' + stringNumber;
                }
            }

            let label = document.getElementById("phoneCore");
            if (label) {
                label.innerHTML = stringNumber;
            }

            this._outputValue = this.phoneHead.value + this.phoneCore.textContent;
            notifyOutputChanged();
        });

        if (!this._isVisible)
            this._container.classList.add("hidden");
        //this._selectInput.disabled = this._isReadOnly;

        let phoneHeadDiv = document.createElement("div");
        phoneHeadDiv.classList.add('selectDiv');
        phoneHeadDiv.appendChild(this.phoneHead);
        let phoneCoreDiv = document.createElement("div");
        phoneCoreDiv.classList.add('labelDiv');
        phoneCoreDiv.appendChild(this.phoneCore);

        const toggleWrapper = document.createElement("div");
        toggleWrapper.appendChild(phoneHeadDiv);
        toggleWrapper.appendChild(phoneCoreDiv);
        toggleWrapper.appendChild(this.buttonGuess);
        this._container.appendChild(toggleWrapper);
        //this._container.classList.add("container");

        //this._container.appendChild(this._toggleInput);
        container.appendChild(this._container);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
        // Add code to update control view
        if (context.parameters.PhoneAttribute.raw != this._outputValue) {
            //this._outputValue = context.parameters.PhoneAttribute.raw;
            //this.phoneCore.textContent = this._outputValue;
            //this._toggleInput.checked = this._outputValue;
        }

        if (context.mode.isVisible != this._isVisible) {
            this._isVisible = context.mode.isVisible;
            (this._isVisible) ? this._container.classList.remove("hidden") : this._container.classList.add("hidden");
        }

        /*if (context.mode.isControlDisabled != this._isReadOnly) {
            this._isReadOnly = context.mode.isControlDisabled;
        }*/
	}

	/**
	 * It is called by the framework prior to a control receiving new data.
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
    {
        let outAttribute = "";
        if (this._outputValue !== null)
            outAttribute = this._outputValue;

        return {
            PhoneAttribute: outAttribute
        };
	}

	/**
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}
