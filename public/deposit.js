function Deposit() {
  const ctx = React.useContext(UserContext);
  const [balance, setBalance] = React.useState(0);
  const [okforSubmission, setokforSubmission] = React.useState(false);
  const [deposit, setDeposit] = React.useState(0);
  const [warning, setWarning] = React.useState("");
  const [verifed, setVerified] = React.useState(false);

  function handleDeposit(e) {
    e.preventDefault();
    const depVal = document.getElementById("depositVal").value;
    if (!checkDepVal(depVal)) {
      alert("Invalid input. Please check your input value again.");
      return;
    }

    // update balance in the backend
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((idToken) => {
        console.log("idToken:", idToken);

        (async () => {
          let response = await fetch(`/deposit/${depVal}`, {
            method: "GET",
            headers: {
              Authorization: idToken,
            },
          });
          let data = await response.json(); // 返回对象用json()，返回文本用text()
          console.log("response:", JSON.stringify(data));

          // if response success, update front-end
          if (data.status) {
            setBalance(Number(data.value)+balance);
            setDeposit(0);
            setWarning("");
  
            alert(`Deposit success!`);
          } else {
            if (data.value === null) {
              setWarning(
                "Some error occurred with the database. Please try again."
              );
            } else {
              // show backend error
              setWarning(
                `Some error occurred. Error ${data.value.name}: ${data.value.message}`
              );
            }
          }
        })();
      })
      .catch((e) => {
        console.log("e:", e);
        setWarning(`Some error occurred. Error ${e.name}: ${e.message}`);
      });
  }

  function checkDepVal(value) {
    const val = Number(value);
    // check if is number
    // use isNaN()
    if (isNaN(val)) {
      setWarning("Please enter a number!");
      return false;
    }

    // check if number is negative
    if (val <= 0) {
      setWarning("To deposit, please enter a positive number!");
      return false;
    }
    setWarning("");
    return true;
  }

  function handleDepositChange(e) {
    setDeposit(e.currentTarget.value);
    const ok = checkDepVal(e.currentTarget.value);
    ok ? setokforSubmission(true) : setokforSubmission(false);
  }

  const form = (
    <form>
      <label>Amount to be deposited:</label>
      <br />
      <input
        type="text"
        className="form-control"
        id="depositVal"
        placeholder="Enter your deposit"
        required
        value={deposit}
        onChange={(e) => handleDepositChange(e)}
      ></input>
      <br />
      <ButtonforSubmit
        okforSubmission={okforSubmission}
        handle={handleDeposit}
        text="Deposit"
      ></ButtonforSubmit>
    </form>
  );
  
  // balance read

  // first check context to see if user is logged in or not
  if (!ctx.loginState) {
    console.log('Im triggered')
    // setVerified(false);
  } else {
    // call server with token for inital display of balance (deposit read)
    try {
      firebase
        .auth()
        .currentUser.getIdToken()
        .then((idToken) => {
          console.log("idToken:", idToken);
          (async () => {
            let response = await fetch("/balance/", {
              method: "GET",
              headers: {
                Authorization: idToken,
              },
            });
            let data = await response.json();
            console.log("response:", JSON.stringify(data));

            // check if request with token is verified
            if (data.status === true) {
              setVerified(true);
              setBalance(data.value);
            } else {
              setVerified(false);
              setBalance(0);
            }
          })();
        })
        .catch((e) => console.log("e:", e));
    } catch (error) {
      console.log(error);
      setWarning(error)
      // setVerified(false);
    }
  }

  return (
    ctx.loginState ? 
    <Card
      bgcolor="Light"
      txtcolor="Dark"
      header="Deposit"
      title={"Balance: " + balance}
      body={form}
      width="20em"
      status={warning}
    ></Card> : 
    <Card
      bgcolor="Light"
      txtcolor="Dark"
      header="Deposit"
      title={"Balance: " + ""}
      body={"Please login first"}
      width="20em"
      status={warning}
    ></Card>
  );
}
