import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class UselessToggle implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _outputValue: boolean | undefined;
    private _defaultValue: boolean | undefined;

    private _isReadOnly: boolean;
    private _isVisible: boolean;

    private _toggleInput: HTMLInputElement;
    private _container: HTMLDivElement;

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
        this._defaultValue = false; //context.parameters.ToggleAttribute.attributes ?.DefaultValue;

        let curentInputData = context.parameters.ToggleAttribute.raw;
        if (curentInputData != null) {
            this._outputValue = curentInputData;
        }
        else {
            this._outputValue = this._defaultValue;
        }

        this._isReadOnly = context.mode.isControlDisabled;
        this._isVisible = context.mode.isVisible;

        this._container = document.createElement("div");

        this._toggleInput = document.createElement("input");
        this._toggleInput.type = "checkbox";
        this._toggleInput.checked = curentInputData as boolean;
        this._toggleInput.id = "cb1";
        this._toggleInput.name = "cb1name";
        this._toggleInput.classList.add("toggle");

        var label = document.createElement("label");
        label.htmlFor = "cb1";
        label.textContent = "label";
        label.classList.add("label_toggle");

        if (!this._isVisible)
            this._container.classList.add("hidden");
        this._toggleInput.disabled = this._isReadOnly;

        label.addEventListener('click', (event) => {
            this._outputValue = !this._toggleInput.checked;
            notifyOutputChanged();
        });

        const toggleWrapper = document.createElement("div");
        //toggleWrapper.className = "pretty p-switch p-fill";
        //toggleWrapper.className = "mt-check-garden";
        toggleWrapper.appendChild(this._toggleInput);
        toggleWrapper.appendChild(label);
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
        if (context.parameters.ToggleAttribute.raw != this._outputValue) {
            this._outputValue = context.parameters.ToggleAttribute.raw;
            this._toggleInput.checked = this._outputValue;
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
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as ???bound??? or ???output???
	 */
	public getOutputs(): IOutputs
    {
        console.log(1);
        return {
            ToggleAttribute: this._outputValue
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
