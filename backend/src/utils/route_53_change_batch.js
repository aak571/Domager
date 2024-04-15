const change_batch_provider = (action, name, type, ttl, record_id, value) => {
    return {
        Changes: [
            {
                Action: action,
                ResourceRecordSet: {
                    Name: name,
                    Type: type,
                    TTL: ttl,
                    Region: 'ap-south-1',
                    SetIdentifier: record_id,
                    ResourceRecords: [
                        {
                            Value: value
                        }
                    ]
                }
            }
        ]
    }
}

const change_batch_for_edit_dns_provider = (
    new_action, new_name, new_type, new_ttl, new_record_id, new_value,
    old_action, old_name, old_type, old_ttl, old_record_id, old_value
) => {
    return {
        Changes: [
            {
                Action: old_action,
                ResourceRecordSet: {
                    Name: old_name,
                    Type: old_type,
                    TTL: old_ttl,
                    Region: 'ap-south-1',
                    SetIdentifier: old_record_id,
                    ResourceRecords: [
                        {
                            Value: old_value
                        }
                    ]
                }
            },
            {
                Action: new_action,
                ResourceRecordSet: {
                    Name: new_name,
                    Type: new_type,
                    TTL: new_ttl,
                    Region: 'ap-south-1',
                    SetIdentifier: new_record_id,
                    ResourceRecords: [
                        {
                            Value: new_value
                        }
                    ]
                }
            }
        ]
    }
}

export { change_batch_provider, change_batch_for_edit_dns_provider }

// make sure u include the hosted zone name after the record name