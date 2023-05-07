import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
;
import { classNames } from 'primereact/utils';
import React, { useRef, useState } from 'react';
import {console} from 'next/dist/compiled/@edge-runtime/primitives/console';
import { Toast } from 'primereact/toast';
import {FournisseurService} from '/src/pages/controller/service/FournisseurService';
import Fournisseur from '/src/pages/controller/model/fournisseur';



const Create = ({visible,onClose,add,showToast}) => {
    const emptyFournisseur = new Fournisseur();




    const [fournisseur, setFournisseur] = useState(emptyFournisseur);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const [fournisseurs, setFournisseurs] = useState([]);




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
        let _item = {...fournisseur};
        _item[`${nom}`] = val;

        setFournisseur(_item);
    };
    const saveItem = async () => {
        setSubmitted(true);

        let _items = [...fournisseurs];
        let _item = { ...fournisseur };

        try {
            if (!_item.id) {
                await FournisseurService.saveFournisseur(_item);
                _item.id = createId();

                _items.push(_item);
                add(_item);

                showToast.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Fournisseur Created',
                    life: 3000,
                });
            }

            setFournisseurs(_items);
            onClose();
            setFournisseur(emptyFournisseur);
        } catch (error) {
            console.log(error);

            showToast.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save fournisseur',
                life: 3000,
            });
        }
    };
    const itemDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" text onClick={saveItem}/>
        </>
    );
    return (

        <Dialog  visible={visible}  style={{width: "450px"}} header="Fournisseur Details" modal
                 className="p-fluid"
                 footer={itemDialogFooter} onHide={hideDialog}>
            <Toast ref={toast} />
            <div className="formgrid grid">

                <div className="field col">
                    <label htmlFor="nom">Nom</label>

                    <InputText id="nom" value={fournisseur.nom} onChange={(e) => onInputChange(e, "nom")} required
                               autoFocus
                               className={classNames({"p-invalid": submitted && !fournisseur.nom})}/>
                    {submitted && !fournisseur.nom && <small className="p-invalid">Nom est obligatoire.</small>}
                </div>
                <div className="field col">
                    <label htmlFor="ice">ICE</label>
                    <InputText id="ice" value={fournisseur.ice} onChange={(e) => onInputChange(e, "ice")} required
                               autoFocus
                               className={classNames({"p-invalid": submitted && !fournisseur.ice})}/>
                    {submitted && !fournisseur.ice && <small className="p-invalid">ICE est obligatoire.</small>}
                </div>
            </div>
            <div className="formgrid grid">
                <div className="field col">
                    <label htmlFor="tel">Tél</label>
                    <InputText id="tel" value={fournisseur.tel} onChange={(e) => onInputChange(e, "tel")}/>
                </div>
                <div className="field col">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={fournisseur.email} onChange={(e) => onInputChange(e, "email")}
                               integeronly/>
                </div>
            </div>
            <div className="formgrid grid">
                <div className="field col">
                    <label htmlFor="adresse">Adresse</label>
                    <InputText id="adresse" value={fournisseur.adresse} onChange={(e) => onInputChange(e, "adresse")}/>
                </div>
                <div className="field col">
                    <label htmlFor="description">Description</label>
                    <InputTextarea id="description" value={fournisseur.description}
                                   onChange={(e) => onInputChange(e, "description")} required rows={3} cols={20}/>
                    {submitted && !fournisseur.description &&
                        <small className="p-invalid">Description est obligatoire.</small>}
                </div>
            </div>
        </Dialog>
    );


};
export default Create;



