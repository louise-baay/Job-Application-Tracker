export function normalizeUrl(url){
    if(!url) return null;
    const trimmed = String(url).trim();
    if(!trimmed) return null;

    if(!/^https?:\/\//i.test(trimmed)){
        return `https://${trimmed}`;
    }

    return trimmed;
}