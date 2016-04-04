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
          <C.Column type="notes">
            <h1>Adding a MYOB AccountRight Connector</h1>
            <ol>
              <li>Register for MYOB developer access at <a target="_blank" href="http://developer.myob.com/contact/register-for-myobapi-access/">http://developer.myob.com/contact/register-for-myobapi-access/</a></li>
              <li>Log into your <a target="_blank" href="https://my.myob.com">my.myob.com</a></li>
              <li>Select 'Developer' from the top menu on the page.</li>
              <li>Click on 'Register App'.</li>
              <li>In Redirect URL use https://bouncer.hoist.io/bounce, fill out the rest of the form and click Register App.</li>
              <li>Copy the Key into 'API Key' here.</li>
              <li>Copy the Secret into 'API Secret' here</li>
            </ol>
            <h2>A note about Company File Id</h2>
            <p>The connector will retrieve all company files during authorize and select the first company file as the company file to use, call setFileId with the Id of the company file you want to use if this isn&#39;t correct. Changes to the company file id used are saved alongside authorization, do a get to '/' to retrieve a list of company files</p>
            <h2>A note about Company File Username and Password</h2>
            <p>To access company files through MYOB AccountRight users need to supply their username and password for the company file itself. To record these you need to call .setUsernameAndPassword after authorizing the connector</p>
            <p>The username and password will be saved along with authorization so you only need to call this once</p>
          </C.Column>
          <C.Column>
            <form onChange={(evt) => {
              this.props.updateField(evt);
            }} onSubmit={(evt) => {
              this.props.updateSettings(evt);
            }}>
              <UI.FormElements.Input inactive={!!(this.props.connectorInstance)} placeholder="Key" name="key" label="Key" type="text" value={this.props._key}/>
              <UI.FormElements.Input placeholder="App Id" name="clientId" label="App Id" type="text" value={this.props.settings.clientId}/>
              <UI.FormElements.Input placeholder="API Key" name="clientSecret" label="API Key" type="text" value={this.props.settings.clientSecret}/>
              <UI.FormElements.Button
                loading={this.props.saving}
                text={this.props.connectorInstance ? 'Save' : 'Create'}
                type="large"
                submit={true}
                onClick={this.props.updateSettings} />
            </form>
          </C.Column>
        </C.Panel>
        <C.Panel name="Advanced" slug="advanced">
          <div>
            <C.PageHeader
              title="Delete Connector."
              subTitle="This will delete any user data associated with this connector" />
            <UI.FormElements.Button
              loading={this.props.saving}
              text='Delete'
              type="large danger"
              onClick={this.props.deleteConnector} />
          </div>
        </C.Panel>
      </C.Page>
    );
  }
}

export default EditForm;
global.EditForm = EditForm;
