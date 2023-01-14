function CreateAccount() {
  const [show, setShow] = React.useState(true);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [okforSubmission, setokforSubmission] = React.useState(false);
  const ctx = React.useContext(UserContext);

  function validate(field, label) {
    if (!field) {
      setStatus("Please enter your " + label + ".");
      // setTimeout(()=>setStatus(''),3000)
      return false;
    }
    return true;
  }

  function clearForm() {
    setName("");
    setEmail("");
    setPassword("");
    setShow(true);
    setStatus("");
    setokforSubmission(false);
  }

  function handleCreate() {
    console.log(name, email, password);

    // check if inputs are valid for submission
    const valiresult = checkfill();
    if (!valiresult) {
      alert('The inputs are invalid. Please check again!')
      return
    };

    // call api for account doc creation
    const url = `/account/create/${name}/${email}/${password}`;
    (async ()=>{
      let res = await fetch(url);
      let data = await res.json();
      console.log(data);
    })()
    
    // sign up with Google so that the user can be verifed thereon and use tokens
    const promise = auth.createUserWithEmailAndPassword(
      email,
      password
    );
    promise.catch((e) => console.log(e.message));
    
    // update the account creation page to show success
    setShow(false);
    alert(`Account ${email} has been successfully created!`);
  }

  function checkfill() {
    if (!validate(name, "name")) return false;
    if (!validate(email, "email")) return false;
    if (!checkEmailPattern()) return false;
    if (!validate(password, "password")) return false;
    if (!checkPwdDigits()) return false;
    setStatus("Perfect! Now we can move on.");
    return true;
  }

  function handleNameChange(e) {
    setName(e.currentTarget.value);
    const ok = checkfill();
    ok ? setokforSubmission(true) : setokforSubmission(false);
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

  function checkPwdDigits() {
    const pwdInput = document.getElementById("password");
    if (pwdInput.value.length < 8) {
      setStatus("Password at least 8 characters long");
      return false;
    }
    const reg = new RegExp("^[a-zA-Z0-9]{8,}$");
    if (!reg.test(pwdInput.value)) {
      setStatus("Password should contain letters and numbers only.");
      return false;
    }
    return true;
  }
  function checkEmailPattern() {
    const reg = new RegExp("[A-Za-z0-9_-]+@[A-Za-z0-9_-]+.[A-Za-z0-9_-]+");
    if (!reg.test(email)) {
      setStatus("Please check your email address");
      return false;
    }
    return true;
  }

  const inputsarray = [
    {
      label: "Name",
      type: "text",
      id: "name",
      placeholder: "Enter name",
      value: name,
      handleChange: handleNameChange,
    },
    {
      label: "Email",
      type: "email",
      id: "email",
      placeholder: "Enter email",
      value: email,
      handleChange: handleEmailChange,
    },
    {
      label: "Password",
      type: "password",
      id: "password",
      placeholder: "Enter password",
      value: password,
      handleChange: handlePwdChange,
      minLength: "8",
      pattern: "[a-zA-Z0-9]{8,}",
      title: "type at least 8 characters",
    },
  ];

  return (
    <Card
      bgcolor="Light"
      txtcolor="Dark"
      header="Create Account"
      title="Get started by creating an account"
      status={status}
      width="20em"
      body={
        show ? (
          <Form
            inputsarray={inputsarray}
            okforSubmission={okforSubmission}
            handleSubmission={handleCreate}
            text="Create Account"
          />
        ) : (
          <div>
            <h5>Success</h5>
            <ButtonforSubmit
              okforSubmission={true}
              handle={clearForm}
              text="Add Another Account"
            />
          </div>
        )
      }
    />
  );
}
