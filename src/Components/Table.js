import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
                  <td>{element["name"]}</td>
                  <td>
                    <Link
                      className="btn btn-primary"
                      to={"/contracts/" + element["_id"]}
                    >
                      Go Now
                    </Link>
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
