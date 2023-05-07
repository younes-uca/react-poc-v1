import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {console} from 'next/dist/compiled/@edge-runtime/primitives/console';
import {Dialog} from 'primereact/dialog';
import Create from '/src/pages/module/admin/view/components/fournisseur/create-admin';
import Edit from '/src/pages/module/admin/view/components/fournisseur/edit-admin';
import {FournisseurService} from '/src/pages/controller/service/FournisseurService';
import Fournisseur from '/src/pages/controller/model/fournisseur';








const Crud = () => {
    const emptyFournisseur = new Fournisseur();


    const [fournisseurs, setFournisseurs] = useState([]);
    const [deleteItemDialog, setDeleteItemDialog] = useState(false);
    const [deleteItemsDialog, setDeleteItemsDialog] = useState(false);
    const [fournisseur, setFournisseur] = useState(emptyFournisseur);
    const [selectedItems, setSelectedItems] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
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
        setSelectedItem(fournisseur);
        setShowCreateDialog(true);

    }

    const add = (fournisseur) => {
        setFournisseurs([...fournisseurs, fournisseur]);
    };
    const update = (updatedItem) => {
        const updatedList = fournisseurs.map((fournisseur) => {
            if (fournisseur.id === updatedItem.id) {
                return updatedItem;
            }
            return fournisseur;
        });
        setFournisseurs(updatedList);
    };


    const deleteItem =  async () => {

        try {
            await FournisseurService.deleteFournisseur(selectedItem.id);
            setDeleteItemDialog(false);
            setFournisseur(emptyFournisseur);
            let _items = fournisseurs.filter((val) => val.id !== selectedItem.id);
            setFournisseurs(_items);
            toast.current.show({severity: 'success', summary: 'Successful', detail: 'Fournisseur Deleted', life: 3000});

        } catch (error) {
            console.log(error);
        }
    };

    const hideDeleteItemDialog = () => {
        setDeleteItemDialog(false);
    };

    const hideDeleteItemsDialog = () => {
        setDeleteItemsDialog(false);
    };
    const confirmDeleteItem = (fournisseur) => {
        setSelectedItem(fournisseur);
        setDeleteItemDialog(true);
    };
    const confirmDeleteSelected = () => {
        setDeleteItemsDialog(true);
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };


    const deleteSelectedItems = async () => {
        await FournisseurService.deleteAll(selectedItems);
        let _items = fournisseurs.filter((val) => !selectedItems.includes(val));
        setFournisseurs(_items);
        setDeleteItemsDialog(false);
        setSelectedItems(null);
        toast.current.show({severity: 'success', summary: 'Successful', detail: 'Fournisseurs Deleted', life: 3000});
    };












    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="sucess" className="mr-2" onClick={showCreateModal} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedItems || !selectedItems.length} />
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
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteItem(rowData)} />
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

    const deleteItemDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteItemDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteItem} />
        </>
    );
    const deleteItemsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteItemsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedItems} />
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
                        selection={selectedItems}
                        onSelectionChange={(e) => setSelectedItems(e.value)}
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
                    <Create visible={showCreateDialog} onClose={() => setShowCreateDialog(false)} add={add} showToast={toast.current} items={fournisseurs} />
                     <Edit  visible={showCreateDialog} onClose={() =>  { setShowCreateDialog(false); setSelectedItem(null); }} showToast={toast.current} selectedItem={selectedItem} update={update}/>
                    <Dialog visible={deleteItemDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteItemDialogFooter} onHide={hideDeleteItemDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {fournisseur && (
                                <span>
                                    Are you sure you want to delete <b>{fournisseur.nom}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteItemsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteItemsDialogFooter} onHide={hideDeleteItemsDialog}>
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