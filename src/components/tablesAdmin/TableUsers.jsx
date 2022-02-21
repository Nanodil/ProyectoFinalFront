import axios from 'axios';
import { useState } from 'react'
import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { FaEraser, FaHistory, FaRegEdit } from 'react-icons/fa';
import { VscSearch } from 'react-icons/vsc';
import swal from 'sweetalert';
import { leerDeLocalStorage } from '../../utils/localStorage';
import { SpinnerRW } from '../spinner/SpinnerRW';
import { ModalEditUser } from './ModalEditUser';

export const TableUsers = ({ usuarios, getUsers, tableUsers, setTableUsers, user }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [userFind, setUserFind] = useState({});
    const [showModalEditar, setShowModalEditar] = useState(false);

    const handleCloseModalEditar = () => setShowModalEditar(false);
    const handleShowModalEditar = () => setShowModalEditar(true);

    const findUser = async (_id) => {
        setIsLoading(true);
        const response = await axios.get(`https://proyecto-final-db.herokuapp.com/api/usuarios/${_id}`);
        setUserFind(response.data);
        setIsLoading(false);
        handleShowModalEditar();
    };

    const alertaBorrar = (_id) => {
        swal({
            title: "Esta seguro?",
            text: "Una vez que lo elimine, el usuario debera crear otra cuenta para ingresar.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    deleteUser(_id)
                }
            });
    }
    const deleteUser = async (_id) => {
        setIsLoading(true);
        const tokenLocal = leerDeLocalStorage('token') || {};
        const headers = { 'x-auth-token': tokenLocal.token };
        await axios.delete(`https://proyecto-final-db.herokuapp.com/api/usuarios/${_id}`, { headers });
        await getUsers();
        setIsLoading(false);
    };
    const refreshUsers = async () => {
        setIsLoading(true);
        await getUsers();
        setIsLoading(false);
    };

    const [busqueda, setBusqueda] = useState('');
    const filter = (e) => {
        e.preventDefault();
        const keyword = e.target.value;

        if (keyword !== '') {
            const results = usuarios.filter((user) => {
                return user.name.toLowerCase().includes(keyword.toLowerCase())
                    || user.email.toLowerCase().includes(keyword.toLowerCase())
                    || user.role.toLowerCase().includes(keyword.toLowerCase());
            });
            setTableUsers(results);
        } else {
            setTableUsers(usuarios);
        }
        setBusqueda(keyword);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center my-2">
                <form className="search-form  " >
                    <div className="input-group search-table">
                        <span
                            className="search-icon"
                            id="basic-addon1"><VscSearch /></span>
                        <input
                            value={busqueda}
                            type="text"
                            className="col-11 search-input"
                            placeholder="Buscar"
                            aria-describedby="basic-addon1"
                            onChange={filter}
                        />
                    </div>
                </form>
                <button onClick={() => refreshUsers()} className=" my-2 p-0 circle-btn">
                    <FaHistory className="p-0  mb-1" />
                </button>
            </div>
            <Table bordered hover>
                <thead>
                    <tr className="text-center" >
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tableUsers.length === 0 ?
                        <tr>
                            <td colSpan="6"> No hay usuarios registrados</td>
                        </tr> :
                        tableUsers.map(({ name, email, role, _id }, i) => (
                            <tr className="text-center" key={i}>
                                <td>{name}</td>
                                <td>{email}</td>
                                <td>{role === 'admin' ? "Administrador " : "Cliente "}</td>
                                <td className="p-1 d-flex ">
                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={
                                            (props) => (
                                                <Tooltip id="button-tooltip" {...props}>
                                                    Editar Usuario
                                                </Tooltip>)
                                        }
                                    >
                                        <button 
                                        disabled={user.email === email }
                                        className={user.email === email? 'm-auto circle-btn-disable' : 'm-auto circle-btn'} onClick={() => findUser(_id)} ><FaRegEdit className="mb-1" /></button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={
                                            (props) => (
                                                <Tooltip id="button-tooltip" {...props}>
                                                    Eliminar Usuario
                                                </Tooltip>)
                                        }
                                    >
                                        <button 
                                        disabled={user.email === email }
                                        className={user.email === email? 'm-auto circle-btn-disable' : 'm-auto circle-btn'} onClick={() => alertaBorrar(_id)} ><FaEraser className="mb-1" /></button>
                                    </OverlayTrigger>
                                </td>

                            </tr>
                        ))}
                </tbody>
            </Table>
            <ModalEditUser
                closeModal={handleCloseModalEditar}
                showModalEditar={showModalEditar}
                userFind={userFind}
                getUsers={getUsers}
            />

            {isLoading && (
                <SpinnerRW />
            )}
        </div>
    )
}