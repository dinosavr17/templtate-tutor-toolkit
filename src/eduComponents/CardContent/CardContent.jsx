// import s from './styles.module.scss'
// import {FormProvider, useForm, useFormContext} from "react-hook-form";
// import React, {useEffect, useRef, useState} from "react";
// import {useDrop} from 'react-dnd';
// // import {NativeTypes} from "react-dnd-html5-backend";
// import {CloseIcon, DownloadIcon} from "../../../shared/ui/icon/ui";
// // import {ButtonPriority, ButtonSize, ButtonType} from "../../../shared/ui/button/const";
// import {IconSize} from "../../../shared/ui/icon/const";
// import {Button} from "../../../shared/ui/button";
// import {File} from "../../../entities/file/ui";
// import {ModalWindow} from "../../../widgets/modal-window/ui";
// import Portal, {createContainer} from "../Board/Portal";
// import CircularProgress from '@mui/material/CircularProgress';
// import Alert from '@mui/material/Alert';
// import AlertTitle from '@mui/material/AlertTitle';
// import styled from '@emotion/styled'
// import {useFilesStore} from "../model/files-store";
// import {IconType} from "../../../shared/types";
// import {getNormalizedDate} from "../../../shared/const";
// import {useCreateRequestStore} from "../../../widgets/create-request/model/create-request-store";
//
//
// const StatusOverlay = styled.div`
//   background: rgba(73, 71, 71, 0.4);
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   backdrop-filter: blur(10px);
//   z-index: 10001;
// `;
//
// const StatusContainer = styled.div`
//   margin: 0 40px;
// `;
//
//
// export function FileLoader({closeFileLoader}) {
//     const [isMounted, setMounted] = useState(false);
//     const MODAL_CONTAINER_ID = 'modal-container-id';
//     const [statusShown, setStatusShown] = useState(false);
//     const [loadingStatus, setLoadingStatus] = useState('unset');
//     const [warningReason, setWarningReason] = useState('');
//     const [rejectedFiles, setRejectedFiles] = useState([]);
//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const {appendFile, updateFile, replacedFileId, appendImage} = useFilesStore();
//     const {isFileLoaderReplace, isPhotoLoader} = useCreateRequestStore();
//     const {watch} = useFormContext();
//     const methods = useForm();
//     useEffect(() => {
//         createContainer({id: MODAL_CONTAINER_ID});
//         setMounted(true);
//     }, []);
//     const loadLink = isPhotoLoader ? BackendRoutes.ADD_IMAGE : BackendRoutes.ADD_FILES
//     let loaderMessage = '';
//     if (isPhotoLoader) {
//         loaderMessage = 'Перетащите изображения в выделенную область, или нажмите на нее, чтобы выбрать изображения на компьютере'
//     } else if (isFileLoaderReplace) {
//         loaderMessage = 'Перетащите один файл в выделенную область, или нажмите на нее, чтобы выбрать файл на компьютере'
//     } else {
//         loaderMessage = 'Перетащите файлы в выделенную область, или нажмите на нее, чтобы выбрать файлы на компьютере'
//     }
//     const validateFetchData = () => {
//         const fetchDataArr = Object.values(uploadedFiles);
//         const maxCount =  isFileLoaderReplace ? 1 : 10
//         if (fetchDataArr.length > maxCount) {
//             setWarningReason('quantity');
//             return 'warning'
//         }
//         const isFileSizeExceedingLimit = fetchDataArr.some(file => file.size > (10 * 1024 * 1024));
//
//         if (isFileSizeExceedingLimit) {
//             setWarningReason('size');
//             return 'warning';
//         }
//
//     }
//     const uploadFile = async (files) => {
//         const rejectedFiles = [];
//         setStatusShown(true);
//         setLoadingStatus('loading');
//
//         const validationResult = validateFetchData();
//
//         if (validationResult !== 'warning') {
//             try {
//                 const promisesResultsArray = await Promise.allSettled(files.map(async (file, index) => {
//                     let id = watch('id')??''
//                     const formData = new FormData();
//                     formData.append('file', file);
//                     formData.append('id', id);
//                     try {
//                         if (!isFileLoaderReplace){
//                             const response = await fetch(loadLink, {
//                                 method: 'POST',
//                                 body: formData,
//                                 headers: {
//                                 },
//                             });
//
//                             if (response.ok) {
//                                 response.json().then((res) => {
//                                     if (isPhotoLoader) {
//                                         appendImage(res)
//                                     } else {
//                                         appendFile( {
//                                             id: res.id,
//                                             rowsData: {
//                                                 name: {
//                                                     link: `${BackendRoutes.DOWNLOAD_FILE}/${res.id}`,
//                                                     text: res.name,
//                                                 },
//                                                 lastChange: getNormalizedDate(Date.now()),
//                                                 whoChange: watch('user'),
//                                                 changesHistory: 'История',
//                                                 replace: IconType.REPLACE,
//                                                 delete: IconType.DELETE,
//                                             }
//                                         })
//                                     }
//
//                                 })
//                             } else {
//                                 throw new Error(`Failed to upload file ${index + 1}`);
//                             }
//                         } else {
//                             const response = await fetch(`${BackendRoutes.UPDATE_FILE}/${replacedFileId}`, {
//                                 method: 'POST',
//                                 body: formData,
//                                 headers: {
//                                 },
//                             });
//                             if (response.ok) {
//                                 response.json().then((res) => {
//                                     updateFile( {
//                                         id: res.id,
//                                         rowsData: {
//                                             name: {
//                                                 link: `${BackendRoutes.DOWNLOAD_FILE}/${res.id}`,
//                                                 text: res.name,
//                                             },
//                                             lastChange: getNormalizedDate(Date.now()),
//                                             whoChange: watch('user'),
//                                             changesHistory: 'История',
//                                             replace: IconType.REPLACE,
//                                             delete: IconType.DELETE,
//                                         }
//                                     })
//                                 })
//                                 // console.log(`File ${index + 1} (${file.name}) uploaded successfully!`);
//                             } else {
//                                 throw new Error(`Failed to upload file ${index + 1}`);
//                             }
//                         }
//
//                     } catch (error) {
//                         console.error(`Error during file upload ${index + 1} (${files[index].name}):`, error);
//                         throw new Error(`${files[index].name}`);
//                     }
//                 }))
//                 //     .then((promiseResultsArray) => {
//                 //     let isLoadingError = false;
//                 //     promiseResultsArray.forEach(item => {
//                 //         if (item.status === 'rejected') {
//                 //             const rejectedFile = (item.reason).toString().replace('Error:', '')
//                 //             rejectedFiles.push(rejectedFile.toString());
//                 //             setRejectedFiles(rejectedFiles);
//                 //             isLoadingError = true;
//                 //             setLoadingStatus('error');
//                 //             setUploadedFiles([]);
//                 //         }
//                 //         else if (!isLoadingError)  {
//                 //             setLoadingStatus('success');
//                 //             setUploadedFiles([]);
//                 //         }
//                 //     })
//                 // });
//                 let isLoadingError = false;
//                 promisesResultsArray.forEach(item => {
//                     if (item.status === 'rejected') {
//                         const rejectedFile = (item.reason).toString().replace('Error:', '');
//                         rejectedFiles.push(rejectedFile.toString());
//                         setRejectedFiles(rejectedFiles);
//                         isLoadingError = true;
//                         setLoadingStatus('error');
//                     } else if (!isLoadingError) {
//                         setLoadingStatus('success');
//                     }
//                     setUploadedFiles([]);
//                 });
//
//
//             } catch (error) {
//                 console.error('Error during file uploads:', error);
//                 setLoadingStatus('error');
//             }
//         } else {
//             setLoadingStatus('warning');
//         }
//     };
//
//     const renderStatusContent = () => {
//         const content = {
//             unset: () => {
//                 return;
//             },
//             loading: () => {
//                 return <CircularProgress
//                     sx={{height: '100px !important', width: '100px !important'}}
//                     color='success'/>
//             },
//             warning: () => {
//                 return <Alert
//                     onClose={() => {
//                         setStatusShown(false);
//                     }}
//                     severity="warning"
//                 >{warningReason === 'quantity' &&
//                     <div>
//                         <AlertTitle>Превышено допустимое количество файлов</AlertTitle>
//                         Количество файлов  — <strong> не должно превышать {isFileLoaderReplace ? 1 : 10}</strong>
//                     </div>
//                 }
//                     {warningReason === 'size' &&
//                         <div>
//                             <AlertTitle>Размер файла слишком большой</AlertTitle>
//                             Размер  — <strong> не должен превышать 10 Мб</strong>
//                         </div>
//                     }
//                 </Alert>
//             },
//             success: () => {
//                 return <Alert
//                     onClose={() => {
//                         setStatusShown(false);
//                         closeFileLoader();
//                     }}
//                     severity="success">
//                     <AlertTitle>Успешно</AlertTitle>
//                     Ваши файлы  — <strong>успешно загружены!</strong>
//                 </Alert>
//             },
//             error: () => {
//                 return <Alert
//                     onClose={() => {
//                         setStatusShown(false);
//                     }}
//                     severity="error"
//                 >
//                     <AlertTitle>Ошибка</AlertTitle>
//                     Произошла ошибка при загрузке {rejectedFiles.length > 0 ? rejectedFiles.join(', ') : 'файлов'}
//                     — <strong> Попробуйте еще раз!</strong>
//                 </Alert>
//             },
//         };
//
//         return content[loadingStatus]();
//     };
//
//     const [{canDrop, isOver}, drop] = useDrop({
//         accept: [NativeTypes.FILE],
//         drop(item, monitor) {
//             const files = monitor.getItem().files;
//             setUploadedFiles(prevFiles => [
//                 ...prevFiles,
//                 ...files.filter((file) =>
//                     isPhotoLoader ? file.type.split('/')[0] === 'image' : file.type !== "" )])
//         },
//         collect: (monitor) => ({
//             canDrop: monitor.canDrop(),
//             isOver: monitor.isOver(),
//         }),
//     });
//
//     const isHoveredWithFile = canDrop && isOver;
//     const opacity = isHoveredWithFile ? 0.5 : 1;
//     const fileInputRef = useRef<HTMLInputElement>(null);
//
//     const handleAreaClick = () => {
//         fileInputRef.current?.click();
//     };
//
//     const handleFileChange = (event) => {
//         const file = event.target.files?.[0];
//
//         if (isPhotoLoader) {
//             if (file && file.type.split('/')[0] === 'image') {
//                 setUploadedFiles(prevFiles => [...prevFiles, file]);
//             }
//         } else if (file && file.type !== '') {
//             setUploadedFiles(prevFiles => [...prevFiles, file]);
//         }
//
//     };
//
//     const handleFileRemove = (index) => {
//         setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
//     };
//     return (
//         <ModalWindow
//             modalClass={s.fileLoaderContainer}
//             closeHandler={closeFileLoader}
//         >
//             <FormProvider { ...methods }>
//                 <div className={s.topSide}>
//                     <h3>Прикрепить файлы</h3>
//                     <div onClick={closeFileLoader}>
//                         <CloseIcon iconSize={IconSize.X24}/>
//                     </div>
//                 </div>
//                 <div className={s.modalForm}
//                 >
//                     <div
//                         ref={drop}
//                         className={uploadedFiles.length === 0 ? s.dropArea : s.dropAreaGrid}
//                         style={{opacity}}
//                         onClick={handleAreaClick}
//                     >
//                         {uploadedFiles.length === 0 ?
//                             <>
//                                 <DownloadIcon iconSize={IconSize.X32}/>
//                                 <h4>
//                                     {loaderMessage}
//                                 </h4>
//                             </>
//                             :
//                             <>
//                                 {uploadedFiles.map((value, index) =>
//                                     <File key={`${index}+${value.name}`} index={index} value={value}
//                                           handleFileRemove={handleFileRemove}/>
//                                 )}
//                             </>
//                         }
//                     </div>
//                     <input
//                         type="file"
//                         style={{display: 'none'}}
//                         ref={fileInputRef}
//                         onChange={handleFileChange}
//                     />
//
//                 </div>
//                 <div className={s.modalButtons}>
//                     <Button
//                         onClick={() => {
//                             if (Object.keys(uploadedFiles).length) {
//                                 uploadFile(uploadedFiles);
//                             }
//                         }}
//                         text={'Загрузить'}
//                         disabled={!(Object.keys(uploadedFiles).length)}
//                     />
//                     {isMounted &&
//                         <Portal id={MODAL_CONTAINER_ID}>
//                             {statusShown &&
//                                 <StatusOverlay>
//                                     <StatusContainer style={{display: 'flex'}}>
//                                         {renderStatusContent()}
//                                     </StatusContainer>
//                                 </StatusOverlay>
//                             }
//                         </Portal>
//                     }
//                     <Button
//                         onClick={closeFileLoader}
//                         text={'Отмена'}
//                     />
//                 </div>
//             </FormProvider>
//         </ModalWindow>
//     )
// }
