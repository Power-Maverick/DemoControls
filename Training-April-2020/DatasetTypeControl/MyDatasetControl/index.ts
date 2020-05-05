import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class MyDatasetControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	/**
	 * Global PCF Variables
	 */
	private theContainer: HTMLDivElement;
	private theNotifyOutputChanged: () => void;
	private theContext: ComponentFramework.Context<IInputs>;

	/**
	 * HTML Elements
	 */
	private mainContainer: HTMLDivElement;
	private myLabel: HTMLLabelElement;

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
		this.theContainer = container;
		this.theNotifyOutputChanged = notifyOutputChanged;
		this.theContext = context;

	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		if (context.parameters.myDataSet.loading) return;

		var child = this.theContainer.lastElementChild;  
        while (child) { 
            this.theContainer.removeChild(child); 
            child = this.theContainer.lastElementChild;
		}

		const dataset = context.parameters.myDataSet;
		const typeAttribute = context.parameters.typeAttribute.raw || "";

		let datasetColumns = dataset.columns;
		let records = this._items(dataset, datasetColumns);

		records.forEach(rec => {
			this.mainContainer = document.createElement("div");

			this.myLabel = document.createElement("label");
			this.myLabel.innerText = rec[typeAttribute];
			this.mainContainer.appendChild(this.myLabel);

			this.theContainer.appendChild(this.mainContainer);
		});

		
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}

	/********** PRIVATE PROPERTIES & FUNCTIONS **********/

	// Get the items from the dataset
	private _items = (ds: DataSet, _columns: DataSetInterfaces.Column[]) => {
		let dataSet = ds;

		var resultSet = dataSet.sortedRecordIds.map(function (key) {
			var record = dataSet.records[key];
			var newRecord: any = {
				key: record.getRecordId()
			};

			for (var column of _columns) {
				newRecord[column.name] = record.getFormattedValue(column.name);
			}

			return newRecord;
		});

		return resultSet;
	}
}