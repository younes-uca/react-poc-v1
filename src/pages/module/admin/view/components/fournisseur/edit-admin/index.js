import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";
import { Toast } from 'primereact/toast';

import {FournisseurService} from "../../../../../../controller/service/FournisseurService";
import {Fournisseur} from "../../../../../../controller/model/Fournisseur";



const Edit = ({visible,onClose,showToast,selectedFournisseur}) => {
    let emptyFournisseur = new Fournisseur();

   const [fournisseur, setFournisseur] = useState( selectedFournisseur || emptyFournisseur);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const [fournisseurs, setFournisseurs] = useState([]);

    useEffect(() => {
        setFournisseur(selectedFournisseur || emptyFournisseur);
    }, [selectedFournisseur]);


    const hideDialog = () => {
        onClose();
    };


    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };
    const onInputChange = (e, nom) => {
        const val = (e.target && e.target.value) || '';
        let _fournisseur = {...selectedFournisseur};
        _fournisseur[`${nom}`] = val;

        setFournisseur(_fournisseur);
    };
    const findIndexById = (id) => {
        return fournisseurs.findIndex(e=>e.id == id);
    };
    const saveFournisseur = async () => {
        setSubmitted(true);

        let _fournisseurs = [...fournisseurs];
        let _fournisseur = { ...fournisseur };

        try {
            if (_fournisseur.id) {
                FournisseurService.putFournisseur(_fournisseur);
                const index = findIndexById(_fournisseur.id);
                _fournisseurs[index] = _fournisseur;
                showToast.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Fournisseur Updated',
                    life: 3000
                });
            }
                setFournisseurs(_fournisseurs);
            onClose();
            setFournisseur(emptyFournisseur);
        } catch (error) {
            console.log(error);

            showToast.show({
                severity: 'error',summary: 'Error',detail: 'Failed to save fournisseur', life: 3000,
            });
        }
    };


    const fournisseurDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" text onClick={saveFournisseur}/>
        </>
    );
    return (

        <Dialog  visible={visible}  style={{width: "450px"}} header="Fournisseur Details" modal
                 className="p-fluid"
                 footer={fournisseurDialogFooter} onHide={hideDialog}>
            <Toast ref={toast} />
            <div className="formgrid grid">

                <div className="field col">
                    <label htmlFor="nom">Nom</label>

                    <InputText id="nom" value={fournisseur ? fournisseur.nom : ''} onChange={(e) => onInputChange(e, "nom")} required
                               autoFocus
                               className={classNames({"p-invalid": submitted && !fournisseur.nom})}/>
                    {submitted && !fournisseur.nom && <small className="p-invalid">Nom est obligatoire.</small>}
                </div>
                <div className="field col">
                    <label htmlFor="ice">ICE</label>
                    <InputText id="ice" value={fournisseur ? fournisseur.ice : ''} onChange={(e) => onInputChange(e, "ice")} required
                               autoFocus
                               className={classNames({"p-invalid": submitted && !fournisseur.ice})}/>
                    {submitted && !fournisseur.ice && <small className="p-invalid">ICE est obligatoire.</small>}
                </div>
            </div>
            <div className="formgrid grid">
                <div className="field col">
                    <label htmlFor="tel">Tél</label>
                    <InputText id="tel" value={fournisseur ? fournisseur.tel : ''} onChange={(e) => onInputChange(e, "tel")}/>
                </div>
                <div className="field col">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={fournisseur ? fournisseur.email : ''} onChange={(e) => onInputChange(e, "email")}
                               integeronly/>
                </div>
            </div>
            <div className="formgrid grid">
                <div className="field col">
                    <label htmlFor="adresse">Adresse</label>
                    <InputText id="adresse" value={fournisseur ? fournisseur.adresse : ''} onChange={(e) => onInputChange(e, "adresse")}/>
                </div>
                <div className="field col">
                    <label htmlFor="description">Description</label>
                    <InputTextarea id="description" value={fournisseur ? fournisseur.description : ''}
                                   onChange={(e) => onInputChange(e, "description")} required rows={3} cols={20}/>
                    {submitted && !fournisseur.description &&
                        <small className="p-invalid">Description est obligatoire.</small>}
                </div>
            </div>
        </Dialog>
    );


};
export default Edit;



