function AllData() {
  const context = React.useContext(UserContext);
  const [userData, setUserData] = React.useState("");
  const [title, setTitle] = React.useState("");
  let tContent;
  React.useEffect(() => {
    // get token first
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((idToken) => {
        console.log("idToken: ", idToken);
        // send request with token to authorize
        (async () => {
          let response = await fetch("/account/all/", {
            method: "GET",
            headers: {
              Authorization: idToken,
            },
          });

          let data = await response.json();
          setUserData(data);
        })();
      })
      .catch((error) => console.error(error));
  }, []);

  if (userData.status === "failure" || userData.status === "unauthorized") {
    tContent = <tr index={0}></tr>;
    setTitle(userData.error);
  } else {
    if (userData.status === "success") {
      tContent = userData.data.map((row, index) => {
        return (
          <tr key={index}>
            <td>{row.email}</td>
            <td>{row.name}</td>
            <td>{row.password}</td>
            <td>{row.role}</td>
          </tr>
        );
      });
    }
  }

  let tblBody = <tbody>{tContent}</tbody>;

  // table head
  const tblHead = (
    <thead>
      <tr>
        <th scope="col">Email</th>
        <th scope="col">Name</th>
        <th scope="col">Password</th>
        <th scope="col">Role</th>
      </tr>
    </thead>
  );

  function makeTbl() {
    return (
      <table className="table">
        {tblHead}
        {tblBody}
      </table>
    );
  }

  return (
    <Card
      bgcolor="Light"
      txtcolor="Dark"
      header="Account Info"
      title={title}
      body={context.loginState ? makeTbl() : "Please log in as admin"}
      width="max-content"
    />
  );
}
