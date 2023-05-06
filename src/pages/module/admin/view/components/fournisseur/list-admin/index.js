import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";
import {Dialog} from "primereact/dialog";
import Create from '../create-admin';
import Edit from "../edit-admin";
import {FournisseurService} from "../../../../../../controller/service/FournisseurService";







const Crud = () => {
    let emptyFournisseur = {

        nom: '',
        ice: null,
        tel: '',
        email: null,
        adresse: null,
        description: '',

    };
    const [fournisseurs, setFournisseurs] = useState([]);
    const [fournisseurDialog, setFournisseurDialog] = useState(false);
    const [deleteFournisseurDialog, setDeleteFournisseurDialog] = useState(false);
    const [deleteFournisseursDialog, setDeleteFournisseursDialog] = useState(false);
    const [fournisseur, setFournisseur] = useState(emptyFournisseur);
    const [selectedFournisseurs, setSelectedFournisseurs] = useState(null);
    const [selectedFournisseur, setSelectedFournisseur] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const router = useRouter();

    const [showCreateDialog, setShowCreateDialog] = useState(false);



    useEffect(async () => {
        await FournisseurService.getFournisseurList().then(response => {
            setFournisseurs(response.data);
        })
            .catch(error => {
                console.error(error);
            });
    }, []);


    const showCreateModal = () => {
        setShowCreateDialog(true);
    };
    const showEditModal = (fournisseur)  => {
        setSelectedFournisseur(fournisseur);


        setShowCreateDialog(true);

    }

    const addFournisseur = (fournisseur) => {
        setFournisseurs([...fournisseurs, fournisseur]);
    };


    const deleteFournisseur =  async () => {

        try {
            await FournisseurService.deleteFournisseur(selectedFournisseur.id);
            setDeleteFournisseurDialog(false);
            setFournisseur(emptyFournisseur);
            let _fournisseurs = fournisseurs.filter((val) => val.id !== selectedFournisseur.id);
            setFournisseurs(_fournisseurs);
            toast.current.show({severity: 'success', summary: 'Successful', detail: 'Fournisseur Deleted', life: 3000});

        } catch (error) {
            console.log(error);
        }
    };

    const hideDeleteFournisseurDialog = () => {
        setDeleteFournisseurDialog(false);
    };

    const hideDeleteFournisseursDialog = () => {
        setDeleteFournisseursDialog(false);
    };
    const confirmDeleteFournisseur = (fournisseur) => {
        setSelectedFournisseur(fournisseur);
        setDeleteFournisseurDialog(true);
    };
    const confirmDeleteSelected = () => {
        setDeleteFournisseursDialog(true);
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };


    const deleteSelectedFournisseurs = async () => {
        await FournisseurService.deleteAll(selectedFournisseurs);
        let _fournisseurs = fournisseurs.filter((val) => !selectedFournisseurs.includes(val));
        setFournisseurs(_fournisseurs);
        setDeleteFournisseursDialog(false);
        setSelectedFournisseurs(null);
        toast.current.show({severity: 'success', summary: 'Successful', detail: 'Fournisseurs Deleted', life: 3000});
    };












    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="sucess" className="mr-2" onClick={showCreateModal} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedFournisseurs || !selectedFournisseurs.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
    const iceBodyTemplate = (rowData) => {
        return(
            <>
                <span className="p-column-title">Ice</span>
                {rowData.ice}
            </>
        );
    };

    const idBodyTemplate = (rowData) => {
        return(
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const nomBodyTemplate = (rowData) => {
        return(
            <>
                <span className="p-column-title">Nom</span>
                {rowData.nom}
            </>
        );
    };

    const telBodyTemplate = (rowData) => {
        return(
            <>
                <span className="p-column-title">Tel</span>
                {rowData.tel}
            </>
        );
    };


    const emailBodyTemplate = (rowData) => {
        return(
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };


    const descriptionBodyTemplate = (rowData) => {
        return(
            <>
                <span className="p-column-title">Description</span>
                {rowData.description}
            </>
        );
    };
    const adresseBodyTemplate = (rowData) => {
        return(
            <>
                <span className="p-column-title">Adresse</span>
                {rowData.adresse}
            </>
        );
    };



    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => showEditModal(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteFournisseur(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Fournisseurs</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const deleteFournisseurDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFournisseurDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteFournisseur} />
        </>
    );
    const deleteFournisseursDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFournisseursDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedFournisseurs} />
        </>
    );
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={fournisseurs}
                        selection={selectedFournisseurs}
                        onSelectionChange={(e) => setSelectedFournisseurs(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} fournisseurs"
                        globalFilter={globalFilter}
                        emptyMessage="No fournisseur found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        <Column field="nom" header="Nom" sortable body={nomBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="ice" header="Ice" sortable body={iceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="tel" header="tel" sortable body={telBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="adresse" header="Adresse" sortable body={adresseBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Description" sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Action" body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                    <Create visible={showCreateDialog} onClose={() => setShowCreateDialog(false)} addFournisseur={addFournisseur} showToast={toast.current} />
                     <Edit  visible={showCreateDialog} onClose={() =>  { setShowCreateDialog(false); setSelectedFournisseur(null); }} showToast={toast.current} selectedFournisseur={selectedFournisseur}/>
                    <Dialog visible={deleteFournisseurDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteFournisseurDialogFooter} onHide={hideDeleteFournisseurDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {fournisseur && (
                                <span>
                                    Are you sure you want to delete <b>{fournisseur.nom}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteFournisseursDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteFournisseursDialogFooter} onHide={hideDeleteFournisseursDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {fournisseur && <span>Are you sure you want to delete the selected fournisseurs?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};
export default Crud;