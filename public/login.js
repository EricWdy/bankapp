function Login() {
  // const [show, setShow] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [okforSubmission, setokforSubmission] = React.useState(false);
  let context = React.useContext(UserContext);

  function validate(field, label) {
    if (!field) {
      setStatus("Please enter your " + label + ".");
      // setTimeout(()=>setStatus(''),3000)
      return false;
    }
    return true;
  }
  function checkfill() {
    if (!validate(email, "email")) return false;
    if (!validate(password, "password")) return false;
    setStatus("Perfect! Now we can move on.");
    return true;
  }

  function handleEmailChange(e) {
    setEmail(e.currentTarget.value);
    const ok = checkfill();
    ok ? setokforSubmission(true) : setokforSubmission(false);
  }

  function handlePwdChange(e) {
    setPassword(e.currentTarget.value);
    const ok = checkfill();
    ok ? setokforSubmission(true) : setokforSubmission(false);
  }

  function handleSubmission(e) {
    e.preventDefault();
    console.log("login info submitted:", email, password);

    // check if inputs are valid for submission
    const valiresult = checkfill();
    if (!valiresult) {
      alert("The inputs are invalid. Please check again!");
      return;
    }

    // call api to verify with database
    const url = `/account/login/${email}/${password}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 1) {
          // login success, update context to trigger Navbar update
          context.updateName(data.msg.name);
          context.updateLogin(true);
          
          // alert(`Welcome, ${data.msg}!`);

          // update the login card
          setEmail("");
          setPassword("");
          setStatus('')

          // authorization with Google to get token
          const promise = auth.signInWithEmailAndPassword(email, password);
          promise.catch((e) => console.log(e.message));

        } else {
          if (data.status === 0) {
            // no user found
            setStatus(data.msg);
          } else {
            // wrong password
            if (data.status === -1) {
              setStatus(data.msg);
            } else {
              // email retrieval error
              setStatus(data.msg);
            }
          }
        }
      });
  }

  const inputsarray = [
    {
      label: "Email",
      type: "email",
      id: "emailLogin",
      placeholder: "Enter email",
      value: email,
      handleChange: handleEmailChange,
    },
    {
      label: "Password",
      type: "password",
      id: "passwordLogin",
      placeholder: "Enter password",
      value: password,
      handleChange: handlePwdChange,
    },
  ];

  return (
    <Card
      txtcolor="Dark"
      header="Log in"
      title="Please enter your account and password."
      status={status}
      width="20em"
      body={
        !context.loginState ? (
          <Form
            inputsarray={inputsarray}
            okforSubmission={okforSubmission}
            handleSubmission={handleSubmission}
            text="Log in"
          />
        ) : (
          <div>
            <h5>Login Success</h5>
            <p>You can do transactions now.</p>
          </div>
        )
      }
    />
  );
}

async function login(email, password) {
  const doc = await retrieveAcc(email);
  if (doc) {
    // if doc exists, check pwd
    if (doc.password === password) {
      // verification success
      return 1;
    } else {
      return -1;
    }
  } else {
    return 0;
  }
}
