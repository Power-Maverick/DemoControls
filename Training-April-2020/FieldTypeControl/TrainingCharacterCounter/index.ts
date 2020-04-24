import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class TrainingCharacterCounter implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	/**
	 * HTML Elements
	 */
	private eleMainContainer: HTMLDivElement;
	private eleTextbox: HTMLTextAreaElement;
	private eleOutputLabel: HTMLLabelElement;

	/**
	 * Global PCF Variables
	 */
	private theNotifyOutputChanged: () => void;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this.theNotifyOutputChanged = notifyOutputChanged;

		// UI
		this.eleMainContainer = document.createElement("div");

		this.eleTextbox = document.createElement("textarea");
		this.eleTextbox.value = context.parameters.InputText.raw || "";
		this.eleTextbox.addEventListener("change", this.OnChange.bind(this));

		this.eleOutputLabel = document.createElement("label");

		// Add to container
		this.eleMainContainer.appendChild(this.eleTextbox);
		this.eleMainContainer.appendChild(this.eleOutputLabel);
		container.appendChild(this.eleMainContainer);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		this.eleTextbox.value = context.parameters.InputText.raw || "";
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			InputText: this.eleTextbox.value
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

	/*******************/
	/*PRIVATE FUNCTIONS*/
	/*******************/
	private OnChange(evnt: Event): void 
	{
		this.CalculateNumberOfCharacters();
	}

	private CalculateNumberOfCharacters()
	{
		let charCount : string = (this.eleTextbox.value.length.toString() || "0");
		let wordCount : string = (this.eleTextbox.value.split(' ').length.toString() || "0");

		this.eleOutputLabel.innerHTML = charCount + (parseInt(charCount) <= 1 ? " character ": " characters");
		this.eleOutputLabel.innerHTML += ", " + wordCount + (parseInt(wordCount) <= 1 ? " word " : " words");

		this.theNotifyOutputChanged();
	}
}