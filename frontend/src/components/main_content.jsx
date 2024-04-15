import { useState, useEffect } from "react"
import { MoonLoader } from 'react-spinners'
import { motion } from 'framer-motion'
import { dns_record_types } from "../dns_record_types.js"
import { cl } from "../console.log.js"
import axios from "axios"

const MainContent = () => {
    const [add_domain_data, set_add_domain_data] = useState({ domain_name: '', description: '', jsx: [] })
    const [edit, set_edit] = useState({ id: '', new_description: '' })
    const [delete_alert, set_delete_alert] = useState({ name: '', id: '' })
    const [dns_data, set_dns_data] = useState({ hosted_zone_name: '', id: '', row: 0, jsx: [] })
    const [selected_record_type, set_selected_record_type] = useState({ name: 'Type ?', type: '' })
    const [create_dns_record_data, set_create_dns_record_data] = useState({ name: '', record_id: '', ttl: '', value: '' })
    const [edit_dns, set_edit_dns] = useState({
        current_name: '', name: '', record_id: '', ttl: '', value: '', type: '', type_name: '',
        name_old: '', record_id_old: '', ttl_old: '', value_old: '', type_old: '', type_name_old: ''
    })
    const [alerts, set_alerts] = useState({ success: false, success_message: '', failure: false, failure_message: '' })
    const [alerts_dns, set_alerts_dns] = useState({ success: false, success_message: '', failure: false, failure_message: '' })
    const [delete_dns, set_delete_dns] = useState({ flag: false, name: '', type: '', ttl: '', record_id: '', value: '', hosted_zone_id: '' })
    const [is_loading, set_is_loading] = useState({ loading: false, dns_loading: false })
    let jsx = []

    const edit_domain_onclick_handler = e => {
        set_edit({
            ...add_domain_data, new_description: e.target.className.split('/')[0],
            id: e.target.className.split('/')[1]
        })
    }

    const delete_domain_onclick_handler = e => {
        set_delete_alert({ ...delete_alert, name: e.target.className.split('/')[0], id: e.target.className.split('/')[1] })
    }

    const prepare_jsx_dns = async details => {

        const prepare_values = values => {
            return values.map(value => {
                return (
                    <div>
                        <div>{value.Value}</div>
                    </div>
                )
            })
        }

        const prepare_values_strings = values => {
            let strings = values.map(value => {
                return value.Value
            })
            return strings.join('.')
        }
        let i = 0
        jsx = await details.map(detail => {
            i++
            return (
                <div>
                    <div className="d-flex justify-content-between col-sm-11 mt-3 mx-auto">
                        <label style={{ "border-color": 'purple', "border-width": '2px' }} id={`record_name_${i}`} className='col-sm-2 text-center card'>{detail.Name}</label>
                        <label style={{ "border-color": 'purple', "border-width": '2px' }} className="col-sm-1 text-center card">{detail.Type}</label>
                        <label style={{ "border-color": 'purple', "border-width": '2px' }} className="col-sm-2 text-center card">{detail.TTL}</label>
                        <label style={{ "border-color": 'purple', "border-width": '2px' }} className="col-sm-3 text-center card">{prepare_values(detail.ResourceRecords)}</label>
                        <label style={{ "border-color": 'purple', "border-width": '2px' }} className="col-sm-3 text-center card">{(!detail.SetIdentifier) ? '____' : detail.SetIdentifier}</label>
                        <i onClick={edit_dns_onclick_handler} disabled={i < 3} className={`${detail.Name}/${detail.Type}/${detail.TTL}/${prepare_values_strings(detail.ResourceRecords)}/${(!detail.SetIdentifier) ? '' : detail.SetIdentifier}/${dns_data.hosted_zone_name}/bi bi-pen-fill btn`} data-bs-toggle="offcanvas" data-bs-target='#edit_dns'> </i>
                        <i id={i} onClick={delete_dns_onclick_handler} disabled={i < 3} className={`${detail.Name}/${detail.Type}/${detail.TTL}/${prepare_values_strings(detail.ResourceRecords)}/${(!detail.SetIdentifier) ? '' : detail.SetIdentifier}/bi bi-trash-fill btn`}> </i>
                    </div>
                </div>
            )
        })
    }

    const edit_dns_onclick_handler = e => {
        const full_record_name = e.target.className.split('/')[0]
        const domain_name = document.getElementById('record_name_1').innerText
        const record_name = full_record_name.slice(0, full_record_name.length - (domain_name.length + 1))
        set_edit_dns({
            ...edit_dns, current_name: e.target.className.split('/')[0], name: record_name,
            type: e.target.className.split('/')[1], ttl: e.target.className.split('/')[2],
            value: e.target.className.split('/')[3], record_id: e.target.className.split('/')[4],
            type_name: e.target.className.split('/')[1] + ' - ' + dns_record_types[e.target.className.split('/')[1]],

            name_old: e.target.className.split('/')[0], type_old: e.target.className.split('/')[1], ttl_old: e.target.className.split('/')[2],
            value_old: e.target.className.split('/')[3], record_id_old: e.target.className.split('/')[4]
        })
    }

    const delete_dns_onclick_handler = async e => {
        if (e.target.id === '1' || e.target.id === '2')
            set_delete_dns({
                ...delete_dns, flag: false
            })
        else
            set_delete_dns({
                ...delete_dns, flag: true, name: e.target.className.split('/')[0], type: e.target.className.split('/')[1],
                ttl: e.target.className.split('/')[2], record_id: e.target.className.split('/')[4],
                value: e.target.className.split('/')[3]
            })
    }

    const delete_dns_permanently_onclick_handler = async () => {
        set_is_loading({ ...is_loading, dns_loading: true })
        const { id } = dns_data
        await axios.post('http://localhost:5000/api/v1/dns/delete', { ...delete_dns, hosted_zone_id: id })
            .then(async res => {
                const message = res.data.message
                const current_record_count = document.getElementById(`row_${dns_data.row}`).innerText
                document.getElementById(`row_${dns_data.row}`).innerText = Number(current_record_count) - 1
                await axios.post('http://localhost:5000/api/v1/dns/get', { id })
                    .then(async res => {
                        await prepare_jsx_dns(res.data.body)
                        set_delete_dns({ ...delete_dns, flag: false })
                        set_alerts_dns({ ...alerts_dns, success: true, success_message: message })
                        set_dns_data({ ...dns_data, jsx: jsx })
                        set_is_loading({ ...is_loading, dns_loading: false })
                    })
                    .catch(err => {
                        cl(err.response.data.message)
                        set_alerts_dns({ ...alerts_dns, failure: true, failure_message: err.response.data.message })
                        set_is_loading({ ...is_loading, dns_loading: false })
                    })
            })
            .catch(err => {
                cl(err.response.data.message)
                set_alerts_dns({ ...alerts_dns, failure: true, failure_message: err.response.data.message })
                set_is_loading({ ...is_loading, dns_loading: false })
            })
    }

    const selected_dns_onclick_handler = async e => {
        set_is_loading({ ...is_loading, dns_loading: true })
        set_alerts_dns({ ...alerts_dns, success: false, success_message: '', failure: false, failure_message: '' })
        set_delete_dns({ ...delete_dns, flag: false, name: '', type: '', ttl: '', record_id: '', value: '', hosted_zone_id: '' })
        const id = e.target.className.split('/')[1]
        await axios.post('http://localhost:5000/api/v1/dns/get', { id })
            .then(async res => {
                cl(res)
                await prepare_jsx_dns(res.data.body)
                set_dns_data({ ...dns_data, hosted_zone_name: e.target.className.split('/')[0], id: e.target.className.split('/')[1], row: e.target.className.split('/')[2], jsx: jsx })
                set_is_loading({ ...is_loading, dns_loading: false })
            })
            .catch(err => {
                cl(err.response.data)
                set_is_loading({ ...is_loading, dns_loading: false })
            })
    }

    const prepare_jsx = async details => {
        let i = 0
        jsx = await details.map(detail => {
            i++
            return (
                <div className="d-flex justify-content-between col-sm-11 mt-3 mx-auto">
                    <label style={{ "border-color": 'purple', "border-width": '2px' }} onClick={selected_dns_onclick_handler} className={`${detail.name}/${detail.id.split('/')[2]}/${i}/ text-decoration-underline btn col-sm-2 text-center card`} data-bs-toggle="modal" data-bs-target='#dns_display'>{detail.name}</label>
                    <label style={{ "border-color": 'purple', "border-width": '2px' }} className="col-sm-3 text-center card">{detail.id.split('/')[2]}</label>
                    <label style={{ "border-color": 'purple', "border-width": '2px' }} id={`row_${i}`} className='col-sm-2 text-center card'>{detail.record_count}</label>
                    <label style={{ "border-color": 'purple', "border-width": '2px' }} className="col-sm-3 text-center card">{(!detail.description) ? '____' : detail.description}</label>
                    <i onClick={edit_domain_onclick_handler} className={`${detail.description}/${detail.id.split('/')[2]}//bi bi-pen-fill btn`} data-bs-toggle="modal" data-bs-target='#edit_descp'> </i>
                    <i onClick={delete_domain_onclick_handler} className={`${detail.name}/${detail.id.split('/')[2]}/bi bi-trash-fill btn`} data-bs-toggle="modal" data-bs-target='#delete_alert'> </i>
                </div>
            )
        })
        set_add_domain_data({ ...add_domain_data, jsx: jsx })
    }

    useEffect(() => {
        set_is_loading({ ...is_loading, loading: true })
        const get_domains = async () => {
            await axios.get('http://localhost:5000/api/v1/domain/get')
                .then(async res => {
                    cl(res.data.body)
                    await prepare_jsx(res.data.body)
                    set_is_loading({ ...is_loading, loading: false })
                })
                .catch(err => {
                    cl(err.response.data)
                    set_alerts({ ...alerts, failure: true, failure_message: err.response.data.message })
                    set_is_loading({ ...is_loading, loading: false })
                })
        }
        get_domains()
    }, [])

    const add_domain_data_onchange_handler = e => {
        set_add_domain_data({ ...add_domain_data, [e.target.id]: e.target.value.trim() })
    }

    const add_domain_onclick_handler = async () => {
        set_is_loading({ ...is_loading, loading: true })
        await axios.post('http://localhost:5000/api/v1/domain/add', add_domain_data)
            .then(async res => {
                const message = res.data.message
                await axios.get('http://localhost:5000/api/v1/domain/get')
                    .then(async res => {
                        await prepare_jsx(res.data.body)
                        set_alerts({ ...alerts, success: true, success_message: message })
                        set_is_loading({ ...is_loading, loading: false })

                    })
                    .catch(err => {
                        cl(err.response.data.message)
                        set_alerts({ ...alerts, failure: true, failure_message: err.response.data.message })
                        set_is_loading({ ...is_loading, loading: false })

                    })
            })
            .catch(err => {
                cl(err.response.data.message)
                set_alerts({ ...alerts, failure: true, failure_message: err.response.data.message })
                set_is_loading({ ...is_loading, loading: false })
            })
    }

    const edit_decp_onchange_handler = e => {
        set_edit({ ...edit, new_description: e.target.value })
    }

    const save_changes_onclick_handler = async () => {
        set_is_loading({ ...is_loading, loading: true })
        await axios.post('http://localhost:5000/api/v1/domain/edit', edit)
            .then(async res => {
                const message = res.data.message
                await axios.get('http://localhost:5000/api/v1/domain/get')
                    .then(async res => {
                        await prepare_jsx(res.data.body)
                        set_alerts({ ...alerts, success: true, success_message: message })
                        set_is_loading({ ...is_loading, loading: false })
                    })
                    .catch(err => {
                        cl(err.response.data)
                        set_alerts({ ...alerts, failure: true, failure_message: err.response.data.message })
                        set_is_loading({ ...is_loading, loading: false })
                    })
            })
            .catch(err => {
                cl(err.response.data)
                set_alerts({ ...alerts, failure: true, success_message: err.response.data.message })
                set_is_loading({ ...is_loading, loading: false })
            })
    }

    const delete_onclick_handler = async () => {
        const { id } = delete_alert
        set_is_loading({ ...is_loading, loading: true })
        await axios.post('http://localhost:5000/api/v1/domain/delete', { id })
            .then(async res => {
                const message = res.data.message
                await axios.get('http://localhost:5000/api/v1/domain/get')
                    .then(async res => {
                        await prepare_jsx(res.data.body)
                        set_alerts({ ...alerts, success: true, success_message: message })
                        set_is_loading({ ...is_loading, loading: false })

                    })
                    .catch(err => {
                        cl(err.response.data.message)
                        set_alerts({ ...alerts, failure: true, failure_message: err.response.data.message })
                        set_is_loading({ ...is_loading, loading: false })

                    })
            })
            .catch(err => {
                cl(err.response.data)
                set_alerts({ ...alerts, failure: true, failure_message: err.response.data.message })
                set_is_loading({ ...is_loading, loading: false })

            })
    }

    const record_type_onclick_handler = e => {
        set_selected_record_type({ ...selected_record_type, name: e.target.innerText, type: e.target.id })
    }

    const record_type_dns_edit_onclick_handler = e => {
        set_edit_dns({ ...edit_dns, type_name: e.target.innerText, type: e.target.id })
    }

    const create_dns_record_onchange_handler = e => {
        if (e.target.id === 'name') set_create_dns_record_data({
            ...create_dns_record_data, name: e.target.value + '.' + dns_data.hosted_zone_name
        })
        else set_create_dns_record_data({ ...create_dns_record_data, [e.target.id]: e.target.value })
    }

    const create_record_onclick_handler = async () => {
        set_is_loading({ ...is_loading, dns_loading: true })
        const { type } = selected_record_type
        const { id } = dns_data
        await axios.post('http://localhost:5000/api/v1/dns/create', { ...create_dns_record_data, type: type, hosted_zone_id: id })
            .then(async res => {
                const message = res.data.message
                const current_record_count = document.getElementById(`row_${dns_data.row}`).innerText
                document.getElementById(`row_${dns_data.row}`).innerText = Number(current_record_count) + 1
                await axios.post('http://localhost:5000/api/v1/dns/get', { id: dns_data.id })
                    .then(async res => {
                        await prepare_jsx_dns(res.data.body)
                        set_dns_data({ ...dns_data, jsx: jsx })
                        set_alerts_dns({ ...alerts_dns, success: true, success_message: message })
                        set_is_loading({ ...is_loading, dns_loading: false })
                    })
                    .catch(err => {
                        cl(err.response.data.message)
                        set_alerts_dns({ ...alerts_dns, failure: true, failure_message: err.response.data.message })
                        set_is_loading({ ...is_loading, dns_loading: false })
                    })
            })
            .catch(err => {
                cl(err.response.data.message)
                set_alerts_dns({ ...alerts_dns, failure: true, failure_message: err.response.data.message })
                set_is_loading({ ...is_loading, dns_loading: false })
            })
    }

    const edit_dns_onchange_handler = e => {
        set_edit_dns({ ...edit_dns, [e.target.id]: e.target.value })
    }

    const edit_dns_update_onclick_handler = async () => {
        set_is_loading({ ...is_loading, dns_loading: true })
        const { id } = dns_data
        const { name_old, type_old, ttl_old, record_id_old, value_old } = edit_dns
        await axios.post('http://localhost:5000/api/v1/dns/delete', {
            name: name_old, type: type_old, ttl: ttl_old, record_id: record_id_old, value: value_old, hosted_zone_id: id
        })
            .then(async () => {
                const { name, type, ttl, record_id, value } = edit_dns
                const full_record_name = name + '.' + dns_data.hosted_zone_name
                await axios.post('http://localhost:5000/api/v1/dns/create', { name: full_record_name, type, ttl, record_id, value, hosted_zone_id: id })
                    .then(async () => {
                        await axios.post('http://localhost:5000/api/v1/dns/get', { id: dns_data.id })
                            .then(async res => {
                                await prepare_jsx_dns(res.data.body)
                                set_alerts_dns({ ...alerts_dns, success: true, success_message: 'DNS record updated successfully' })
                                set_dns_data({ ...dns_data, jsx: jsx })
                                set_is_loading({ ...is_loading, dns_loading: false })
                            })
                            .catch(err => {
                                cl(err.response.data.message)
                                set_alerts_dns({ ...alerts_dns, failure: true, failure_message: err.response.data.message })
                                set_is_loading({ ...is_loading, dns_loading: false })
                            })
                    })
                    .catch(async err => {
                        await axios.post('http://localhost:5000/api/v1/dns/create', {
                            name: name_old, type: type_old, ttl: ttl_old, record_id: record_id_old, value: value_old, hosted_zone_id: id
                        })
                            .then(() => {
                                set_alerts_dns({ ...alerts_dns, failure: true, failure_message: err.response.data.message })
                                set_is_loading({ ...is_loading, dns_loading: false })
                            })
                            .catch(() => {
                                set_alerts_dns({ ...alerts_dns, failure: true, failure_message: err.response.data.message })
                                set_is_loading({ ...is_loading, dns_loading: false })
                            })
                    })
            })
            .catch(err => {
                cl(err.response.data.message)
                set_alerts_dns({ ...alerts_dns, failure: true, failure_message: 'Faced an unexpected problem while updating your DNS record, please try again later' })
                set_is_loading({ ...is_loading, dns_loading: false })
            })
    }

    const success_alert_close_onclick_handler = () => {
        set_alerts({ ...alerts, success: false })
    }

    const failure_alert_close_onclick_handler = () => {
        set_alerts({ ...alerts, failure: false })
    }

    const success_alert_dns_close_onclick_handler = () => {
        set_alerts_dns({ ...alerts_dns, success: false })
    }

    const failure_alert_dns_close_onclick_handler = () => {
        set_alerts_dns({ ...alerts_dns, failure: false })
    }

    const delete_dns_alert_close_onclick_handler = () => {
        set_delete_dns({ ...delete_dns, flag: false })
    }

    const add_domain_cancel_onclick_handler = () => {
        document.getElementById('domain_name').value = ''
        document.getElementById('description').value = ''
        set_add_domain_data({ ...add_domain_data, domain_name: '', description: '' })
    }

    const stop_dns_creation_onclick_handler = () => {
        document.getElementById('name').value = ''
        document.getElementById('ttl').value = ''
        document.getElementById('value').value = ''
        document.getElementById('record_id').value = ''
        set_create_dns_record_data({ ...create_dns_record_data, name: '', record_id: '', ttl: '', value: '' })
        set_selected_record_type({ ...selected_record_type, name: 'Type ?', type: '' })

    }

    return (
        <div className="container-fluid">



            {is_loading.loading && <div style={{ marginTop: '180px' }}>
                <MoonLoader className="mx-auto" color="#f507d5" size={200} loading={is_loading.loading} speedMultiplier={3} />
            </div>}

            {!is_loading.loading && <div>
                <div className="container-fluid d-flex justify-content-start">
                    <p className="col-sm-5 mx-auto text-center">An easiest Domain Managing dashboard for all your DNS records</p>
                </div>

                {alerts.success && <motion.div animate={{ x: [-100, 0] }} transition={{ duration: 2 }} className='col-sm-7 text-center mx-auto card alert alert-success alert-dismissible fade show'>
                    <button onClick={success_alert_close_onclick_handler} className="btn-close" data-bs-dismiss="alert"></button>
                    <strong>Job Done !!!</strong>{alerts.success_message}
                </motion.div>}

                {alerts.failure && <motion.div animate={{ x: [10, -20, 20, -20, 20, -20, 20, -20, 0] }} transition={{ duration: 0.5 }} className="col-sm-7 text-center mx-auto card alert alert-danger alert-dismissible fade show">
                    <button onClick={failure_alert_close_onclick_handler} className="btn-close" data-bs-dismiss="alert"></button>
                    <strong>SORRY, We found an Issue !</strong>{alerts.failure_message}
                </motion.div>}

                <div className="text-center">
                    <i onClick={add_domain_cancel_onclick_handler} className="bi bi-plus-circle-fill btn fs-1 text-primary" data-bs-toggle="offcanvas" data-bs-target="#add_domain"></i>
                </div>

                {add_domain_data.jsx.length === 0 && <div style={{ marginTop: '100px', opacity: '0.3' }} className="text-center fs-1">
                    <i>You do not have any Domains registered on AWS Route 53 yet !!!</i>
                    <p>Start enrolling by clicking the plus icon at the top of this page</p>
                </div>}

                {add_domain_data.jsx.length > 0 && <motion.div animate={{ y: 10 }} transition={{ duration: 0.9 }}>
                    <div className="d-flex justify-content-between col-sm-11 mx-auto">
                        <label style={{ background: 'grey', color: 'white' }} className="fs-5 fw-bold col-sm-2 text-center rounded border border-2 border-dark">Domain</label>
                        <label style={{ background: 'grey', color: 'white' }} className="fs-5 fw-bold col-sm-3 text-center rounded border border-2 border-dark">ID</label>
                        <label style={{ background: 'grey', color: 'white' }} className="fs-5 fw-bold col-sm-2 text-center rounded border border-2 border-dark">Record count</label>
                        <label style={{ background: 'grey', color: 'white' }} className="fs-5 fw-bold col-sm-3 text-center rounded border border-2 border-dark">Description</label>
                        <i className="text-muted btn">ED</i>
                        <i className="text-muted btn">DL</i>
                    </div>
                    {add_domain_data.jsx}
                </motion.div>}

                <div style={{ background: 'purple' }} className="offcanvas offcanvas-start shadow" id="add_domain">
                    <div className="offcanvas-header d-flex flex-column">
                        <h4 className="container-fluid text-light mt-3">Go ahead and enter your Domain and we will register it for you on AWS Route 53. It is that simple.</h4>
                        <div className="col-sm-12">
                            <input style={{ "border-color": 'blue', "border-width": '3px' }} id="domain_name" onChange={add_domain_data_onchange_handler} placeholder=" Domain name ?" className="rounded navbar text-center mt-5 col-sm-12"></input>
                            <textarea style={{ "border-color": 'blue', "border-width": '3px' }} id="description" onChange={add_domain_data_onchange_handler} placeholder=" description (optional)" className="rounded navbar text-center mt-3 col-sm-12"></textarea>
                            <div className="text-center">
                                <button onClick={add_domain_cancel_onclick_handler} className="rounded text-light bg-secondary mt-5 btn" data-bs-dismiss="offcanvas">Cancel</button>
                                <button onClick={add_domain_onclick_handler} disabled={!add_domain_data.domain_name} className="rounded text-light bg-success mt-5 mx-5 btn" data-bs-dismiss="offcanvas">Add Domain</button>
                            </div>
                        </div>
                    </div>
                    <div className="offcanvas-body">

                    </div>
                </div>

                <div className="modal fade" id="edit_descp">
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div style={{ background: 'purple', color: 'white' }} className="modal-header ">
                                <h4 className="modal-title mx-auto">Edit Description</h4>
                            </div>

                            <div className="modal-body text-center">
                                <input style={{ "border-color": 'blue', "border-width": '2px' }} onChange={edit_decp_onchange_handler} className="rounded col-sm-12 navbar" placeholder=" Add a Description" value={edit.new_description}></input>
                                <button onClick={save_changes_onclick_handler} className="btn btn-info mx-auto mt-3" data-bs-dismiss="modal">Save Changes</button>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="modal fade" id="delete_alert">
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content">

                            <div style={{ background: 'purple', color: 'white' }} className="modal-header card fs-5">
                                This will <span style={{ color: 'tomato' }} className="text-decoration-underline">permanently</span> unenrol <span style={{ background: 'purple', color: 'white' }} className="fw-bold card col-sm-12 text-center border border-1 border-dark">{delete_alert.name}</span>
                            </div>


                            <div className="modal-footer">
                                <div className="modal-body text-center col-sm-12">How sure are you ???</div>
                                <button className="btn btn-danger mx-auto bg-success" data-bs-dismiss="modal">Go back</button>
                                <button onClick={delete_onclick_handler} className="btn btn-danger mx-auto" data-bs-dismiss="modal">Very sure</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}

            <div>
                <div className="modal fade" id="dns_display">
                    <div className="modal-dialog modal-fullscreen">
                        {<div className="modal-content">

                            {<div style={{ background: 'purple', color: 'white' }} className="modal-header ">
                                <p className="modal-title fs-3 mx-auto">These are your DNS records of <span className="fw-bold">{dns_data.hosted_zone_name} ({dns_data.id})</span></p>
                            </div>}

                            {is_loading.dns_loading && <div style={{ marginTop: '180px' }}>
                                <MoonLoader className="mx-auto" color="#f507d5" size={200} loading={is_loading.dns_loading} speedMultiplier={3} />
                            </div>}

                            {alerts_dns.success && <motion.div animate={{ x: [-100, 0] }} transition={{ duration: 2 }} className='mt-3 col-sm-7 text-center mx-auto card alert alert-success alert-dismissible fade show'>
                                <button onClick={success_alert_dns_close_onclick_handler} className="btn-close" data-bs-dismiss="alert"></button>
                                <strong>Job Done !!!</strong>{alerts_dns.success_message}
                            </motion.div>}

                            {alerts_dns.failure && <motion.div animate={{ x: [10, -20, 20, -20, 20, -20, 20, -20, 0] }} transition={{ duration: 0.5 }} className="mt-3 col-sm-7 text-center mx-auto card alert alert-danger alert-dismissible fade show">
                                <button onClick={failure_alert_dns_close_onclick_handler} className="btn-close" data-bs-dismiss="alert"></button>
                                <strong>SORRY, We found an Issue !</strong>{alerts_dns.failure_message}
                            </motion.div>}

                            {!is_loading.dns_loading && delete_dns.flag && <motion.div animate={{ x: [-50, 50, 0] }} transition={{ duration: 0.8 }} style={{ background: 'purple' }} className="mt-3 col-sm-7 text-center mx-auto card alert alert-primary alert-dismissible fade show">
                                <p className="text-light">Are you sure you wanna <span style={{ color: 'tomato' }} className="text-decoration-underline">permanently</span> unlink <strong>{delete_dns.name}</strong> from <strong>{dns_data.hosted_zone_name}</strong> ?</p>
                                <div>
                                    <button onClick={delete_dns_alert_close_onclick_handler} className="btn btn-success me-5" >Not now</button>
                                    <button onClick={delete_dns_permanently_onclick_handler} className="btn btn-danger">Yes please</button>
                                </div>
                            </motion.div>}
                            {!is_loading.dns_loading && <motion.div animate={{ y: 10 }} transition={{ duration: 1 }} className="modal-body">
                                <div className="d-flex justify-content-between col-sm-11 mx-auto">
                                    <label style={{ background: 'grey', color: 'white' }} className='col-sm-2 text-center card fs-4 border border-2 border-dark'>Record name</label>
                                    <label style={{ background: 'grey', color: 'white' }} className="col-sm-1 text-center card fs-4 border border-2 border-dark">Type</label>
                                    <label style={{ background: 'grey', color: 'white' }} className="col-sm-2 text-center card fs-4 border border-2 border-dark">TTL (in seconds)</label>
                                    <label style={{ background: 'grey', color: 'white' }} className="col-sm-3 text-center card fs-4 border border-2 border-dark">Route traffic to</label>
                                    <label style={{ background: 'grey', color: 'white' }} className="col-sm-3 text-center card fs-4 border border-2 border-dark">Rocord ID</label>
                                    <i className='btn text-muted'>ED</i>
                                    <i className='btn text-muted'>DL</i>
                                </div>
                                {dns_data.jsx}
                            </motion.div>}

                            {!is_loading.dns_loading && <div className="modal-footer">
                                <button className="rounded bg-warning btn" data-bs-dismiss="modal">Leave</button>
                                <i onClick={stop_dns_creation_onclick_handler} className="bi bi-plus-square-fill fs-1 mx-auto btn text-info" data-bs-toggle="offcanvas" data-bs-target="#new_dns"></i>
                            </div>}
                        </div>}
                    </div>

                    <div className="offcanvas offcanvas-top" id="new_dns">
                        <div style={{ background: 'purple', color: 'white' }} className="text-center">
                            <h1 className="offcanvas-title mx-auto">Create a DNS record</h1>
                        </div>
                        <div className="offcanvas-body text-center">
                            <div className="d-flex justify-content-between col-sm-12">

                                <div className="col-sm-2 ">
                                    <input style={{ 'border-color': 'purple', borderWidth: '4px' }} id="name" onChange={create_dns_record_onchange_handler} placeholder="Record name ?" className="fs-5 me-1 navbar rounded text-center col-sm-7"></input>
                                    <p style={{ marginTop: '0px' }} className="col-sm-2 fs-5">{`.${dns_data.hosted_zone_name}`}</p>
                                </div>
                                <input style={{ height: '50px', 'border-color': 'purple', borderWidth: '4px' }} id="record_id" onChange={create_dns_record_onchange_handler} placeholder="Record ID ?" className="fs-5 navbar rounded text-center col-sm-1"></input>
                                <input style={{ height: '50px', 'border-color': 'purple', borderWidth: '4px' }} id="ttl" onChange={create_dns_record_onchange_handler} placeholder="TTL (in sec) ?" className="fs-5 navbar rounded text-center col-sm-1"></input>

                                <div className="dropdown dropstart  text-center">
                                    <button style={{ height: '50px', 'border-color': 'purple', borderWidth: '4px' }} className="fs-5 btn dropdown-toggle navbar p-2 col-sm-12" data-bs-toggle="dropdown">
                                        {selected_record_type.name}
                                    </button>
                                    <ul style={{ background: 'purple', maxHeight: '100px', maxWidth: '400px', 'overflow-y': 'auto', 'overflow-x': 'auto' }} className="dropdown-menu">
                                        <li><a onClick={record_type_onclick_handler} id='A' className="dropdown-item btn text-info text-end" >A - To an IPv4</a></li>
                                        <li><a onClick={record_type_onclick_handler} id='AAAA' className="dropdown-item btn text-info text-end">AAAA - To an IPv6</a></li>
                                        <li><a onClick={record_type_onclick_handler} id='CNAME' className="dropdown-item btn text-info text-end">CNAME - To another domain name</a></li>
                                        <li><a onClick={record_type_onclick_handler} id='MX' className="dropdown-item btn text-info text-end">MX - Specifies mail servers</a></li>
                                        <li><a onClick={record_type_onclick_handler} id='TXT' className="dropdown-item btn text-info text-end">TXT - To verify email senders and application-specific values</a></li>
                                        <li><a onClick={record_type_onclick_handler} id='PTR' className="dropdown-item btn text-info text-end">PTR - Maps an IP address to a domain name</a></li>
                                        <li><a onClick={record_type_onclick_handler} id='SRV' className="dropdown-item btn text-info text-end">SRV - Application-specific values that identify servers</a></li>
                                        <li><a onClick={record_type_onclick_handler} id='SPF' className="dropdown-item btn text-info text-end">SPF - Not recommended</a></li>
                                        <li><a onClick={record_type_onclick_handler} id='NAPTR' className="dropdown-item btn text-info text-end">NAPTR - Used by DDDS applications</a></li>
                                        <li><a onClick={record_type_onclick_handler} id='CAA' className="dropdown-item btn text-info text-end">CAA - Restricts CAs that can create SSL/TLS certificates for the domain</a></li>
                                        <li><a onClick={record_type_onclick_handler} id='DS' className="dropdown-item btn text-info text-end">DS - Delegation Signer, used to establish a chain of trust for DNSSEC</a></li>
                                    </ul>
                                </div>

                                <input style={{ height: '50px', 'border-color': 'purple', borderWidth: '4px' }} id="value" onChange={create_dns_record_onchange_handler} placeholder="Value/Route traffic to ?" className="fs-5 navbar rounded text-center col-sm-2"></input>

                            </div>
                            <button onClick={stop_dns_creation_onclick_handler} className="btn btn-danger me-5" data-bs-dismiss="offcanvas">Stop</button>
                            <button onClick={create_record_onclick_handler} disabled={!(create_dns_record_data.name && create_dns_record_data.record_id && create_dns_record_data.ttl && create_dns_record_data.value && selected_record_type.type)} className="btn btn-success" data-bs-dismiss="offcanvas">Create record</button>
                        </div>
                    </div>

                    <div className="offcanvas offcanvas-bottom" id="edit_dns">
                        <div style={{ background: 'purple', color: 'white' }} className="text-center">
                            <p className="offcanvas-title fs-1">Edit your DNS record: <span className="fw-bold">{edit_dns.current_name}</span></p>
                        </div>

                        <div className="offcanvas-body">

                            <div className="d-flex justify-content-between col-sm-12">

                                <div className="col-sm-2">
                                    <input style={{ 'border-color': 'purple', borderWidth: '4px' }} id="name" onChange={edit_dns_onchange_handler} value={edit_dns.name} placeholder="Record name ?" className="fs-5 me-1 navbar rounded text-center col-sm-7"></input>
                                    <p className="col-sm-2 fs-5">{`.${dns_data.hosted_zone_name}`}</p>
                                </div>
                                <input style={{ height: '50px', 'border-color': 'purple', borderWidth: '4px' }} id="record_id" onChange={edit_dns_onchange_handler} value={edit_dns.record_id} placeholder="Record ID ?" className="fs-5 navbar rounded text-center col-sm-1"></input>
                                <input style={{ height: '50px', 'border-color': 'purple', borderWidth: '4px' }} id="ttl" onChange={edit_dns_onchange_handler} value={edit_dns.ttl} placeholder="TTL (in sec) ?" className="fs-5 navbar rounded text-center col-sm-1"></input>

                                <div className="dropdown dropstart  text-center">
                                    <button style={{ 'border-color': 'purple', borderWidth: '4px' }} className="fs-5 btn dropdown-toggle navbar p-2 col-sm-12" data-bs-toggle="dropdown">
                                        {edit_dns.type_name}
                                    </button>
                                    <ul style={{ background: 'purple', maxHeight: '100px', 'overflow-y': 'auto' }} className="dropdown-menu">
                                        <li><a onClick={record_type_dns_edit_onclick_handler} id='A' className="dropdown-item btn text-info" >A - To an IPv4</a></li>
                                        <li><a onClick={record_type_dns_edit_onclick_handler} id='AAAA' className="dropdown-item btn text-info">AAAA - To an IPv6</a></li>
                                        <li><a onClick={record_type_dns_edit_onclick_handler} id='CNAME' className="dropdown-item btn text-info">CNAME - To another domain name</a></li>
                                        <li><a onClick={record_type_dns_edit_onclick_handler} id='MX' className="dropdown-item btn text-info">MX - Specifies mail servers</a></li>
                                        <li><a onClick={record_type_dns_edit_onclick_handler} id='TXT' className="dropdown-item btn text-info">TXT - To verify email senders and application-specific values</a></li>
                                        <li><a onClick={record_type_dns_edit_onclick_handler} id='PTR' className="dropdown-item btn text-info">PTR - Maps an IP address to a domain name</a></li>
                                        <li><a onClick={record_type_dns_edit_onclick_handler} id='SRV' className="dropdown-item btn text-info">SRV - Application-specific values that identify servers</a></li>
                                        <li><a onClick={record_type_dns_edit_onclick_handler} id='SPF' className="dropdown-item btn text-info">SPF - Not recommended</a></li>
                                        <li><a onClick={record_type_dns_edit_onclick_handler} id='NAPTR' className="dropdown-item btn text-info">NAPTR - Used by DDDS applications</a></li>
                                        <li><a onClick={record_type_dns_edit_onclick_handler} id='CAA' className="dropdown-item btn text-info">CAA - Restricts CAs that can create SSL/TLS certificates for the domain</a></li>
                                        <li><a onClick={record_type_dns_edit_onclick_handler} id='DS' className="dropdown-item btn text-info">DS - Delegation Signer, used to establish a chain of trust for DNSSEC</a></li>
                                    </ul>
                                </div>

                                <input style={{ height: '50px', 'border-color': 'purple', borderWidth: '4px' }} id="value" onChange={edit_dns_onchange_handler} value={edit_dns.value} placeholder="Value/Route traffic to ?" className="fs-5 navbar rounded text-center col-sm-2"></input>
                            </div>

                            <div className="text-center">
                                <button className="btn btn-danger me-5" data-bs-dismiss="offcanvas">Exit</button>
                                <button onClick={edit_dns_update_onclick_handler} disabled={!(edit_dns.name && edit_dns.ttl && edit_dns.value && edit_dns.record_id && edit_dns.type)} className="btn btn-info" data-bs-dismiss="offcanvas">Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default MainContent