function Withdraw() {
  const ctx = React.useContext(UserContext);
  const [balance, setBalance] = React.useState(0);
  const [okforSubmission, setokforSubmission] = React.useState(false);
  const [withdraw, setWithdraw] = React.useState(0);
  const [warning, setWarning] = React.useState("");
  const [verified, setVerified] = React.useState(false);

  function handleWithdraw(event) {
    event.preventDefault();
    const withdrawVal = document.getElementById("withdrawVal").value;
    if (!checkWithdrawVal(withdrawVal)) {
      alert("Invalid input. Please check your input value again.");
      return;
    }

    // update backend
    // to send request with header, first get token
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((idToken) => {
        // send request
        (async () => {
          const url = `/withdraw/${withdrawVal}`;
          let response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: idToken,
            },
          });
          let data = await response.json();
          console.log("data:", JSON.stringify(data));

          // check data status
          if (data.status) {
            // backend update success, update front-end
            setBalance(balance + Number(data.value));
            setWithdraw(0)
            setWarning('')
            alert('Withdraw success');
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
      .catch((err) => console.log(err));

    
  }

  function checkWithdrawVal(value) {
    const val = Number(value);
    console.log(`val is ${val}`);
    // check if is number
    // use isNaN()
    if (isNaN(val)) {
      setWarning("Please enter a number!");
      return false;
    }
    
    // check if number is overdraft
    if (val > balance) {
      setWarning("Overdraft. Please withdraw no more than your balance.");
      return false;
    }

    if (val <= 0) {
      setWarning("Please enter a positive value.");
      return false;
    }

    setWarning("");
    return true;
  }

  function handleWithdrawChange(e) {
    setWithdraw(e.currentTarget.value);
    const ok = checkWithdrawVal(e.currentTarget.value);
    ok ? setokforSubmission(true) : setokforSubmission(false);
  }

  const form = (
    <form>
      <label>Amount to be withdrawn:</label>
      <br />
      <input
        type="text"
        className="form-control"
        id="withdrawVal"
        placeholder="Enter your draft value"
        required
        value={withdraw}
        onChange={(e) => handleWithdrawChange(e)}
      ></input>
      <br />
      <ButtonforSubmit
        okforSubmission={okforSubmission}
        handle={handleWithdraw}
        text="Withdraw"
      ></ButtonforSubmit>
    </form>
  );

  // balance read

  // hide inputs if not logged in
  if (!ctx.loginState) {
    console.log('Im triggered')
    // setBalance(0)
    // setVerified(false);
  } else {
    // only get token with Google if logged in
    try {
      firebase
        .auth()
        .currentUser.getIdToken()
        .then((idToken) => {
          if (idToken) {
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

              if (data.status === true) {
                setVerified(true);
                setBalance(data.value);
              } else {
                setVerified(false);
                setBalance(0);
              }
            })();
          }
        })
        .catch((e) => console.log(e));
    } catch (error) {
      console.error(error);
      setWarning(error.message);
    }
  }

  return (
    ctx.loginState ?
    <Card
      bgcolor="Light"
      txtcolor="Dark"
      header="Withdraw"
      title={"Balance: " + balance}
      width="20em"
      body={form}
      status={warning}
    ></Card> : <Card
    bgcolor="Light"
    txtcolor="Dark"
    header="Withdraw"
    title={"Balance: "}
    width="20em"
    body={"Please log in first"}
    status={warning}
  ></Card>
  );
}
