const dns_record_types = {
    A: "To an IPv4",
    AAAA: "To an IPv6",
    CNAME: "To another domain name",
    MX: "Specifies mail servers",
    TXT: "To verify email senders and application-specific values",
    PTR: "Maps an IP address to a domain name",
    SRV: "Application-specific values that identify servers",
    SPF: "Not recommended",
    NAPTR: "Used by DDDS applications",
    CAA: "Restricts CAs that can create SSL/TLS certificates for the domain",
    DS: "Delegation Signer, used to establish a chain of trust for DNSSEC"
}

export { dns_record_types }



// const { Route53Client, ChangeResourceRecordSetsCommand } = require("@aws-key/client-route-53");
// import dotenv from 'dotenv';

// dotenv.config(); // Load environment variables

// const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
// const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

// const hostedZoneId = "YOUR_HOSTED_ZONE_ID"; // Replace with the ID of your hosted zone
// const recordName = "www.example.com"; // Name of the record to edit
// const recordType = "A"; // Type of the record (e.g., A, CNAME, etc.)

// // Existing record values (replace with your actual values)
// const oldRecordValue = "old-ip-address.com";

// // New record values (replace with your desired changes)
// const newRecordValue = "new-ip-address.com";

// async function editDNSRecord() {
//   try {
//     const client = new Route53Client({
//       region: "your-region", // Specify your region if required (optional for global services)
//       credentials: {
//         accessKeyId: ACCESS_KEY_ID,
//         secretAccessKey: SECRET_ACCESS_KEY,
//       },
//     });

//     const changeBatch = {
//       Changes: [
//         {
//           Action: "DELETE", // Specify DELETE to remove the old record
//           ResourceRecordSet: {
//             Name: recordName,
//             Type: recordType,
//             ResourceRecords: [{ Value: oldRecordValue }], // Specify the record to delete based on name, type, and value
//           }
//         }
//         {
//           Action: "CREATE", // Specify CREATE to add the new record
//           ResourceRecordSet: {
//             Name: recordName,
//             Type: recordType,
//             TTL: 300, // Optional Time To Live (in seconds)
//             ResourceRecords: [{ Value: newRecordValue }], // New record value
//           }
//         }
//       ]
//     }

//     const command = new ChangeResourceRecordSetsCommand({
//       HostedZoneId: hostedZoneId,
//       ChangeBatch: changeBatch,
//     });

//     await client.send(command);
//     console.log(`DNS record '${recordName}' (type: ${recordType}) edited in hosted zone '${hostedZoneId}'`);
//   } catch (error) {
//     console.error("Error editing DNS record:", error);
//   }
// }

// editDNSRecord();
