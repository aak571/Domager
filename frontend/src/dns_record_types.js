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