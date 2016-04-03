/* globals UI */

var C = UI.Views.Connector;

class EditForm extends C.View {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
    if (!props.connector) {
      this.state.mode = 'connect';
    }
  }
  connect() {
    this.props.onConnect();
  }
  render() {
    return (
      <C.Page default="setup" {...this.props}>
        <C.Panel name="Setup" slug="setup">
          <form onChange={(evt) => {
            this.props.updateField(evt);
          }} onSubmit={(evt) => {
            this.props.updateSettings(evt);
          }}>
            <UI.FormElements.Input placeholder="Key" name="key" label="Key" type="text" value={this.props._key}/>
            <UI.FormElements.Input placeholder="App Id" name="clientId" label="App Id" type="text" value={this.props.settings.clientId}/>
            <UI.FormElements.Input placeholder="API Key" name="clientSecret" label="API Key" type="text" value={this.props.settings.clientSecret}/>
            <UI.FormElements.Button
              loading={this.props.saving}
              text={this.props.connectorInstance ? 'Save' : 'Create'}
              type="large"
              submit={true}
              onClick={this.props.updateSettings} />
          </form>
        </C.Panel>
        <C.Panel name="instructions" slug="Instructions"></C.Panel>
      </C.Page>
    );
  }
}

export default EditForm;
global.EditForm = EditForm;
