import {WeblinkerCategory} from "@/api/gen/model";
import {notFound} from "next/navigation";

export const categories: WeblinkerCategory[] = [
    {id: 5052434, name: 'Magic: the Gathering', parent: 0, slug: 'magic-the-gathering'},
    {id: 5126624, name: 'Pokémon', parent: 0, slug: 'pokemon'},
    {id: 5126616, name: 'One Piece', parent: 0, slug: 'one-piece'},
    {id: 5126625, name: 'Star Wars: Unlimited', parent: 0, slug: 'star-wars-unlimited'},
    {id: 5126626, name: 'Flesh and Blood', parent: 0, slug: 'flesh-and-blood'},
    {id: 5126628, name: 'Yu-Gi-Oh!', parent: 0, slug: 'yu-gi-oh'},
    {id: 5126629, name: 'Disney Lorcana', parent: 0, slug: 'disney-lorcana'},
    {id: 5063564, name: 'Gry planszowe', parent: 0, slug: 'gry-planszowe'},
    {id: 5052433, name: 'Inne gry', parent: 0, slug: 'inne-gry'},
    {id: 5126627, name: 'Akcesoria', parent: 0, slug: 'akcesoria'},
]

export function getCategoryById(id: number | string): WeblinkerCategory {
    const parsedId = typeof id === 'string' ? Number(id) : id;
    if (parsedId === undefined || parsedId === null || Number.isNaN(parsedId)) {
        return categories[0];
    }
    const found = categories.find((c) => c.id === parsedId);
    if (!found) return notFound();
    return found;
}

export function getCategoryBySlug(slug: string): WeblinkerCategory {
    if (!slug) throw new Error('slug is required');
    const normalized = slug.trim().toLowerCase();
    const found = categories.find((c) => (c.slug ?? '').toLowerCase() === normalized);
    if (!found) return notFound();
    return found;
}
