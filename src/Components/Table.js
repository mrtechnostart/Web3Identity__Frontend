import React, { useEffect, useState } from "react";
import axios from "axios";
const Table = () => {
  const [data, setData] = useState([]);
  async function getData() {
    const dbData = await axios.get("http://localhost:4004/postdata");
    setData(dbData["data"]["tasks"]);
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <table class="table container">
        <thead class="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Deployer Address</th>
            <th scope="col">Contract Address</th>
            <th scope="col">Name</th>
            <th scope="col">Link</th>
          </tr>
        </thead>
        <tbody>
          {data.map((element, index) => {
            return (
              <>
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{element["deployer"]}</td>
                  <td>{element["contract"]}</td>
                  <td>{element["name"]}</td>
                  <td>
                    <a
                      className="btn btn-primary"
                      href={"/contracts/" + element["_id"]}
                    >
                      Go Now
                    </a>
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
