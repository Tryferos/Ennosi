import Image from 'next/image'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { PopupFrame } from './PopupElement'
import { Project, ProjectPartners, Publicity, User } from '@prisma/client'
import { RequestJsonOptions, UploadPartner, UploadProject } from '../../types/misc';
import { toast } from 'react-toastify';

type ImageProps = {
    url: string;
    file: File | Blob;
}
const ProjectPopup: FC<(Project & {partners: {user: UploadPartner & {id: string}}[]}) | null> = (props) => {

    const [thumbnail, setThumbnail] = useState<ImageProps | null>(props?.thubmnailUrl ? { url: props.thubmnailUrl, file: new Blob() } : null);
    const [images, setImages] = useState<ImageProps[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const form = useRef<HTMLFormElement>(null);
    const [title, setTitle] = useState<string>(props?.title || '');
    const [description, setDescription] = useState<string>(props?.description || '');
    const [github, setGithub] = useState<string>(props?.githubUrl || '');
    const [demo, setDemo] = useState<string>(props?.demoUrl || '');
    const [partners, setPartners] = useState<UploadPartner[]>((props?.partners && props.partners.map(item => ({...item.user, userId: item.user.id}))) ?? []);
    const [privacy, setPrivacy] = useState<Publicity>(props?.published ?? Publicity.Public);
    const [query, setQuery] = useState<string>('');
    const [searchFocus, setSearchFocus] = useState<boolean>(false);
    const search = useRef<HTMLInputElement>(null);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (event.target.name) {
            case 'title':
                setTitle(event.target.value);
                break;
            case 'description':
                setDescription(event.target.value);
                break;
            case 'github':
                setGithub(event.target.value);
                break;
            case 'demo':
                setDemo(event.target.value);
                break;
            case 'privacy':
                setPrivacy(event.target.value as Publicity);
                break;
            default:
                break;
        }
    }

    useEffect(() => {

        if (!search || !search.current || !form || !form.current) return;
        form.current.addEventListener('click', (ev) => {
            if (ev.target === search.current) {
                setSearchFocus(true);
                return;
            }
            setSearchFocus(false);
        });

    }, [])

    const handleProjectUpload = async () => {
        const upload = new Promise((resolve, reject) => {
            handleSubmit(resolve, reject);
        });

        toast.promise(upload, {
            error: 'Failed to upload project',
            success: 'Project uploaded successfully',
            pending: 'Uploading project...',
        })
    }
    const handleSubmit = async (resolve: (value?: unknown) => void, rej: (value?: unknown) => void) => {
        if (!form || !form.current) return rej();
        form.current.reportValidity();
        if (!form.current.checkValidity()) return rej();
        const project: UploadProject & { partners: Pick<UploadPartner, 'userId'>[] } = {
            title,
            description,
            githubUrl: github,
            demoUrl: demo,
            id: props?.id,
            thubmnailUrl: props?.id ? props.thubmnailUrl : null,
            published: privacy,
            partners: partners.map((partner) => ({ userId: partner.userId, }))
        }
        const res = await fetch('/api/project/create', {
            ...RequestJsonOptions,
            body: JSON.stringify(project)
        })
        const data = await res.json();
        if (!data || !data.success || data.id == null) {
            rej();
            return;
        }
        const id = data.id;
        if(id==props?.id && props?.thubmnailUrl == thumbnail?.url){
            resolve();
            setTimeout(() => {
                window.location.reload();
            }, 1000)
            return;
        }
        if (thumbnail) {
            const formData = new FormData();
            formData.append("image", thumbnail.file);
            const res2 = await fetch(`/api/project/upload?id=${id}&type=thumbnail`, {
                method: 'POST',
                body: formData
            })
            const data = await res2.json();
            if (!data.success) return rej();;
        }
        if (images.length > 0) {
            let index = 0;
            for await (const image of images) {
                const formData = new FormData();
                formData.append("image", image.file);
                const res3 = await fetch(`/api/project/upload?id=${id}&type=images&index=${index}`, {
                    method: 'POST',
                    body: formData
                })
                const data = await res3.json();
                if (!data.success) return rej();
                index++;
            }
        }
        resolve();
        setTimeout(() => {
            window.location.reload();
        }, 1000)
    }

    const handleUpload = () => {
        if (!inputRef || !inputRef.current) return;
        inputRef.current.click();
    }

    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return
        const file = files[0]
        const url = URL.createObjectURL(file);
        const image = { url: url, file: file };
        if (thumbnail) { setImages([...images, image]); return; }
        setThumbnail(image);
    }

    const handleRemove = (index: number) => {
        if (index == -1) {
            setThumbnail(null);
            return;
        }
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    }

    const addPartner = (partner: UploadPartner) => {
        setPartners(prev => [...prev, partner]);
    }

    return (
        <PopupFrame title={`${props?.id ? `Editing project ${props.title}` : 'Create a new Project'}`} form={true} onSubmit={handleProjectUpload}>
            <form ref={form} className='py-4 px-6 text-primary flex flex-col gap-y-6'>
                <div className='flex flex-col gap-y-2'>
                    <label className='text-gray-600 font-wotfard-md' htmlFor='title'>Project Title<span aria-label='required'>*</span></label>
                    <input onChange={handleChange} value={title} placeholder="Enter Project's title" type='text' name='title' id='title' className='outline outline-1 outline-gray-300 py-2 rounded px-4 focus:outline-gray-400' required />
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label className='text-gray-600 font-wotfard-md' htmlFor='description'>Project Description<span aria-label='required'>*</span></label>
                    <textarea onChange={handleChange} value={description} placeholder="Enter Project's description" name='description' id='description' className='w-full h-[100px] max-h-[200px] outline outline-1 focus:outline-gray-400 min-h-[75px] outline-gray-200 rounded-md py-2 px-4' required></textarea>
                </div>
                <div className='flex w-full gap-x-10'>
                    <div className='flex flex-col gap-y-2 w-full'>
                        <label className='text-gray-600 font-wotfard-md' htmlFor='github'>Github URL</label>
                        <input autoComplete='off' onChange={handleChange} value={github} placeholder="Enter Github url" type='text' name='github' id='github' className='outline outline-1 outline-gray-300 py-2 rounded px-4 focus:outline-gray-400' />
                    </div>
                    <div className='flex flex-col gap-y-2 w-full'>
                        <label className='text-gray-600 font-wotfard-md' htmlFor='demo'>Demo URL</label>
                        <input autoComplete='off' onChange={handleChange} value={demo} placeholder="Enter Demo url" type='text' name='demo' id='demo' className='outline outline-1 outline-gray-300 py-2 rounded px-4 focus:outline-gray-400' />
                    </div>
                </div>
                <div className='flex gap-x-10'>
                    <div className='basis-[50%] flex flex-col gap-y-4 relative'>
                        <div className='flex justify-between'>
                            <label className='font-wotfard-md'>Project Partners</label>
                            <label className='font-wotfard-md'>({partners.length} added)</label>
                        </div>
                        <input onChange={(ev) => setQuery(ev.target.value)} autoComplete="off" ref={search} placeholder="Search people" type='text' name='connections' id='connections'
                            className='outline outline-1 outline-gray-300 py-2 rounded px-4 focus:outline-gray-400' />
                        <SearchPartners addPartner={addPartner} query={query} focus={searchFocus} excludePartners={partners.map((_p) => _p.userId as string)} />
                        {!searchFocus && partners.length > 0 &&
                            <ul className='flex flex-col gap-y-2 min-h-[50px] max-h-[120px] overflow-y-auto scrollbar-dropdown outline outline-1 outline-gray-300 rounded shadow-below'>
                                {
                                    partners.map((partner, index) =>
                                        <li key={index} className='flex gap-x-2 items-center w-full justify-between rounded py-1 px-2 bg-white border-b-[1px] border-b-gray-300'>
                                            <figure className='h-12 w-12 rounded-full relative bg-gray-200 border-2 border-white'>
                                                <Image src={'/images/person.jpg'} alt='profile image' fill={true} style={{ objectFit: 'cover' }} className='rounded-full' />
                                            </figure>
                                            <p className='font-wotfard-md'>{partner.firstName} {partner.lastName}</p>
                                            <div onClick={() => setPartners(partners.filter((_, i) => i !== index))} className='px-2 py-1 rounded-full cursor-pointer hover:bg-gray-100'>
                                                <Image src={'/images/clear_icon.png'} alt='delete image' width={24} height={24} />
                                            </div>
                                        </li>
                                    )
                                }
                            </ul>}
                    </div>
                    <div className='flex flex-col gap-y-4 basis-[50%]'>
                        <label htmlFor='privacy' className='font-wotfard-md'>Who can see this Project?</label>
                        <fieldset className='flex flex-col gap-y-2'>
                            <li className='flex gap-x-2 font-wotfard-md cursor-pointer'>
                                <input onChange={handleChange} checked={privacy == Publicity.Public} value={Publicity.Public} className='accent-secondary scale-110 cursor-pointer -mt-4' type="radio" name="privacy" id="public" />
                                <label htmlFor='public' className='flex flex-col '>
                                    <p className='font-wotfard-md'>Public</p>
                                    <p className='font-wotfard text-gray-400 text-sm'>This project is visible by everyone.</p>
                                </label>
                            </li>
                            <li className='flex gap-x-2 font-wotfard-md cursor-pointer items-start'>
                                <input onChange={handleChange} checked={privacy == Publicity.Friends} value={Publicity.Friends} className='accent-secondary scale-110 cursor-pointer mt-2' type='radio' name='privacy' id='friends' />
                                <label htmlFor='friends' className='flex flex-col p-'>
                                    <p className='font-wotfard-md'>Friends</p>
                                    <p className='font-wotfard text-gray-400 text-sm'>This project is only visible by people you are connected with.</p>
                                </label>
                            </li>
                            <li className='flex gap-x-2 font-wotfard-md cursor-pointer'>
                                <input onChange={handleChange} checked={privacy == Publicity.Private} value={Publicity.Private} className='accent-secondary scale-110 cursor-pointer -mt-4' type="radio" name="privacy" id="private" />
                                <label htmlFor='private' className='flex flex-col p-'>
                                    <p className='font-wotfard-md'>Private</p>
                                    <p className='font-wotfard text-gray-400 text-sm'>This project is only visible by you.</p>
                                </label>
                            </li>
                        </fieldset>
                    </div>
                </div>
                <div className='flex gap-y-2 justify-between items-center'>
                    <label className='text-gray-600 font-wotfard-md' htmlFor='title'>Project Images</label>
                    <div title='Upload an image' onClick={handleUpload} className='px-2 py-1 rounded-full cursor-pointer hover:bg-gray-100'>
                        <Image src={'/images/upload_icon.png'} alt='upload image' width={24} height={24} />
                    </div>
                    <input ref={inputRef} onChange={handleFile} accept="image/*" type="file" className="w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-wotfard-md
                            file:bg-violet-50 file:text-secondary
                            hover:file:bg-violet-100
                            " hidden />
                </div>
                <ul className='flex flex-wrap gap-x-5 gap-y-5'>
                    {
                        thumbnail &&
                        <ImagePreview image={thumbnail.url} label='Post Thumbnail' handleRemove={() => handleRemove(-1)} />
                    }
                    {
                        images.map((image, index) =>
                            <ImagePreview key={index} image={image.url} label={`Post Image`} handleRemove={() => handleRemove(index)} />)
                    }
                </ul>
            </form>
        </PopupFrame>
    )
}

export default ProjectPopup

const SearchPartners: FC<{ addPartner: (partner: UploadPartner) => void; query: string; focus: boolean; excludePartners: string[] }> = (props) => {
    const query = props.query.toLowerCase();
    const [partners, setPartners] = useState<UploadPartner[]>([]);
    useEffect(() => {

        fetchPartners();

    }, [props])
    const fetchPartners = () => {
        (async () => {
            const res = await fetch('/api/profile/friend/get', RequestJsonOptions);
            const data = await res.json();
            setPartners(prev => data.partners.filter((_p: UploadPartner) => !props.excludePartners.includes(_p.userId) && (_p.firstName.toLowerCase().includes(query) || _p.lastName.toLowerCase().includes(query) || _p.firstName.concat(' ', _p.lastName).toLowerCase().includes(query))));
        })();
    }
    return <ul className={`${!props.focus && 'hidden'} absolute scrollbar-dropdown max-h-[150px] overflow-y-auto top-24 left-0 bg-white min-h-[50px] w-full z-[400] gap-y-2 flex-col flex outline outline-1 outline-gray-300 rounded shadow-allsides`}>
        {
            partners.length == 0 ? <p className='text-center'>No potential partners found.</p> :
                partners.map((partner, _i) =>
                    <li key={_i} onClick={() => props.addPartner(partner)} className='flex gap-x-2 cursor-pointer hover:bg-gray-100 items-center w-full justify-between  py-1 px-2  rounded'>
                        <figure className='h-10 w-10 rounded-full relative bg-gray-200 border-2 border-white'>
                            <Image src={`${partner.image ?? '/images/person.jpg'}`} alt='profile image' fill={true} style={{ objectFit: 'cover' }} className='rounded-full' />
                        </figure>
                        <p className='font-wotfard-md'>{partner.firstName} {partner.lastName}</p>
                        <div className='px-1 py-2 rounded-full cursor-pointer hover:bg-gray-100'>
                            <Image className='rotate-45' src={'/images/clear_icon.png'} alt='add image' width={20} height={20} />
                        </div>
                    </li>
                )
        }
    </ul>
}

const ImagePreview: FC<{ image: string; label: string; handleRemove: () => void }> = (props) => {

    return (
        <li className='relative hover:outline-gray-400 px-10 py-4 outline outline-1 rounded outline-gray-300 shadow-below'>
            <div className='relative w-[200px] h-[200px] mt-5'>
                <Image src={props.image} alt='project image' fill={true} style={{ objectFit: 'contain' }} />
            </div>
            <div className='absolute flex w-full top-1 right-0 justify-center px-4 items-center py-1 pb-2 border-b-[1px]'>
                <p className='font-wotfard-md'>{props.label}</p>
                <div onClick={props.handleRemove} className='px-2 py-1 rounded-full cursor-pointer hover:bg-gray-100 absolute right-1'>
                    <Image src={'/images/clear_icon.png'} alt='delete image' width={24} height={24} />
                </div>
            </div>
        </li>
    )
}