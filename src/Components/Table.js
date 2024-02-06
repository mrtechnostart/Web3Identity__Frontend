import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Link } from "react-router-dom";
const Table = () => {
  const [data, setData] = useState([]);

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  async function getData() {
    const dbData = await axios.get(
      "http://localhost:4004/postdata/chainId/" + chainId
    );
    console.log(dbData);
    setData(dbData["data"]["tasks"]);
  }
  useEffect(() => {
    getData();
  }, [chainId]);
  return (
    <div className="table-responsive">
      <table className="table container">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Link</th>
            <th scope="col">Deployer Address</th>
          </tr>
        </thead>
        <tbody>
          {data.map((element, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{element["name"]}</td>
                <td>
                  <Link
                    className="btn btn-primary"
                    to={"/contracts/" + element["_id"]}
                  >
                    Go Now
                  </Link>
                </td>
                <td>{element["deployer"]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
