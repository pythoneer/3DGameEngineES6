
export class Vector3f
{
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor (x, y, z)
    {
            this.x = x;
            this.y = y;
            this.z = z;
    }

    /**
     *
     * @returns {number}
     */
    length()
    {
        return  Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     *
     * @param {Vector3f} r
     * @returns {number}
     */
    dot(r)
    {
        return this.x * r.getX() + this.y * r.getY() + this.z * r.getZ();
    }

    /**
     *
     * @param {Vector3f} r
     * @returns {Vector3f}
     */
    cross(r)
    {
        var x_ = this.y * r.getZ() - this.z * r.getY();
        var y_ = this.z * r.getX() - this.x * r.getZ();
        var z_ = this.x * r.getY() - this.y * r.getX();

        return new Vector3f(x_, y_, z_);
    }

    /**
     *
     * @returns {Vector3f}
     */
    normalize()
    {
        var length = length();

        this.x /= length;
        this.y /= length;
        this.z /= length;

        return this;
    }

    /**
     *
     * @returns {null}
     */
    rotate()
    {
        return null;
    }

    /**
     *
     * @param {Vector3f} r
     * @returns {Vector3f}
     */
    addv(r)
    {
        return new Vector3f(this.x + r.getX(), this.y + r.getY(), this.z + r.getZ());
    }

    /**
     *
     * @param {number} r
     * @returns {Vector3f}
     */
    addf(r)
    {
        return new Vector3f(this.x + r, this.y + r, this.z + r);
    }

    /**
     *
     * @param {Vector3f} r
     * @returns {Vector3f}
     */
    subv(r)
    {
        return new Vector3f(this.x - r.getX(), this.y - r.getY(), this.z - r.getZ());
    }

    /**
     *
     * @param {number} r
     * @returns {Vector3f}
     */
    subf(r)
    {
        return new Vector3f(this.x - r, this.y - r, this.z - r);
    }

    /**
     *
     * @param {Vector3f} r
     * @returns {Vector3f}
     */
    mulv(r)
    {
        return new Vector3f(this.x * r.getX(), this.y * r.getY(), this.z * r.getZ());
    }

    /**
     *
     * @param {number} r
     * @returns {Vector3f}
     */
    mulf(r)
    {
        return new Vector3f(this.x * r, this.y * r, this.z * r);
    }

    /**
     *
     * @param {Vector3f} r
     * @returns {Vector3f}
     */
    divv(r)
    {
        return new Vector3f(this.x / r.getX(), this.y / r.getY(), this.z / r.getZ());
    }

    /**
     *
     * @param {number} r
     * @returns {Vector3f}
     */
    divf(r)
    {
        return new Vector3f(this.x / r, this.y / r, this.z / r);
    }

    /**
     *
     * @returns {n.x|*|Number}
     */
    getX()
    {
        return this.x;
    }

    /**
     *
     * @param {number} x
     */
    setX(x)
    {
        this.x = x;
    }

    /**
     *
     * @returns {Number}
     */
    getY()
    {
        return this.y;
    }

    /**
     *
     * @param {Number} y
     */
    setY(y)
    {
        this.y = y;
    }

    /**
     *
     * @returns {*}
     */
    getZ()
    {
        return this.z;
    }

    /**
     *
     * @param {Number} z
     */
    setZ(z)
    {
        this.z = z;
    }
}
