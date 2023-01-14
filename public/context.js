const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const HashRouter = ReactRouterDOM.HashRouter;
const UserContext = React.createContext({
  loginState: null,
  userName: null,
  updateLogin: () => {}, // later this will be the setState function to update the state
  updateName: () => {}, //
});

// introduce the Firebase auth service
// ----------------------------------------------
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  "your Firebase config"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function Card(props) {
  function classNamees() {
    const bg = props.bgcolor ? "bg-" + props.bgcolor : " ";
    const txt = props.txtcolor ? "text-" + props.txtcolor : " text-white";
    return "card mb-3 " + bg + txt;
  }

  return (
    <div className={classNamees()} style={{ maxWidth: props.width }}>
      <div className="card-header">{props.header}</div>
      <div className="card-body">
        {props.title && <h5 className="card-title">{props.title}</h5>}
        {props.text && <p className="card-text">{props.text}</p>}
        {props.body}
        {props.status && <div id="createStatus">{props.status}</div>}
      </div>
    </div>
  );
}

function ButtonforSubmit(props) {
  function checkStyle() {
    var btnStyle = props.okforSubmission
      ? "btn btn-primary"
      : "btn btn-primary disabled";
    return btnStyle;
  }
  if (props.okforSubmission) {
    return (
      <input
        type="submit"
        className={checkStyle()}
        onClick={props.handle}
        value={props.text}
      ></input>
    );
  } else {
    return (
      <input
        type="submit"
        className={checkStyle()}
        onClick={props.handle}
        disabled
        value={props.text}
      ></input>
    );
  }
}

function Form(props) {
  // check values for input keys. If not exist, set default values (optional parameters)
  // type, id, placeholder, value, onChange are mandatory props
  function checkVal(obj) {
    if (obj.required === null) {
      obj.required = True;
    }

    if (obj.inputMode === null) {
      obj.inputMode = "text";
    }

    if (obj.minLength === null) {
      obj.minLength = "";
    }

    if (obj.title === null) {
      obj.title = "";
    }

    if (obj.pattern === null) {
      obj.pattern = "";
    }
  }
  let inputs = props.inputsarray.map((input, index) => {
    checkVal(input);
    return (
      <li key={input.id} className="list-group-item">
        <label htmlFor={input.id}>{input.label}</label>

        <input
          type={input.type}
          className="form-control"
          id={input.id}
          placeholder={input.placeholder}
          value={input.value}
          onChange={(e) => input.handleChange(e)}
          required={input.required}
          inputMode={input.inputMode}
          minLength={input.minLength}
          title={input.title}
          pattern={input.pattern}
        />
      </li>
    );
  });

  return (
    <form>
      <ul className="list-group">
      {inputs}
      </ul>
      <ButtonforSubmit
        okforSubmission={props.okforSubmission}
        handle={props.handleSubmission}
        text={props.text}
      />
    </form>
  );
}
