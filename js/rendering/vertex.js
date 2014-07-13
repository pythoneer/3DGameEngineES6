export class Vertex
{
    /**
     *
     * @param {Vector3f} pos
     */
    constructor(pos)
    {
        this.pos = pos;
        this.SIZE = 3;
    }

    /**
     *
     * @returns {*}
     */
    getPos()
    {
        return this.pos;
    }

    /**
     *
     * @param {Vector3f} pos
     */
    setPos(pos)
    {
        this.pos = pos;
    }
}