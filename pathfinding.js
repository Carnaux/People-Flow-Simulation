! function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(e.threePathfinding = {})
}(this, function (e) {
    var t = function () {};
    t.computeCentroids = function (e) {
        var t, r, n;
        for (t = 0, r = e.faces.length; t < r; t++)(n = e.faces[t]).centroid = new THREE.Vector3(0, 0, 0), n.centroid.add(e.vertices[n.a]), n.centroid.add(e.vertices[n.b]), n.centroid.add(e.vertices[n.c]), n.centroid.divideScalar(3)
    }, t.roundNumber = function (e, t) {
        return Number(e.toFixed(t))
    }, t.sample = function (e) {
        return e[Math.floor(Math.random() * e.length)]
    }, t.mergeVertexIds = function (e, t) {
        var r = [];
        if (e.forEach(function (e) {
                t.indexOf(e) >= 0 && r.push(e)
            }), r.length < 2) return [];
        r.includes(e[0]) && r.includes(e[e.length - 1]) && e.push(e.shift()), r.includes(t[0]) && r.includes(t[t.length - 1]) && t.push(t.shift()), r = [], e.forEach(function (e) {
            t.includes(e) && r.push(e)
        });
        for (var n = r[1], o = r[0], i = e.slice(); i[0] !== n;) i.push(i.shift());
        for (var s = 0, a = t.slice(); a[0] !== o;)
            if (a.push(a.shift()), s++ > 10) throw new Error("Unexpected state");
        return a.shift(), a.pop(), i = i.concat(a)
    }, t.setPolygonCentroid = function (e, t) {
        var r = new THREE.Vector3,
            n = t.vertices;
        e.vertexIds.forEach(function (e) {
            r.add(n[e])
        }), r.divideScalar(e.vertexIds.length), e.centroid.copy(r)
    }, t.cleanPolygon = function (e, t) {
        for (var r = [], n = t.vertices, o = 0; o < e.vertexIds.length; o++) {
            var i, s, a, h = n[e.vertexIds[o]];
            0 === o ? (i = e.vertexIds[1], s = e.vertexIds[e.vertexIds.length - 1]) : o === e.vertexIds.length - 1 ? (i = e.vertexIds[0], s = e.vertexIds[e.vertexIds.length - 2]) : (i = e.vertexIds[o + 1], s = e.vertexIds[o - 1]), a = n[s];
            var c = n[i].clone().sub(h),
                u = a.clone().sub(h),
                d = c.angleTo(u);
            if (d > Math.PI - .01 && d < Math.PI + .01) {
                var l = [];
                e.neighbours.forEach(function (t) {
                    t.vertexIds.includes(e.vertexIds[o]) || l.push(t)
                }), e.neighbours = l
            } else r.push(e.vertexIds[o])
        }
        e.vertexIds = r, this.setPolygonCentroid(e, t)
    }, t.isConvex = function (e, t) {
        var r = t.vertices;
        if (e.vertexIds.length < 3) return !1;
        for (var n = !0, o = [], i = 0; i < e.vertexIds.length; i++) {
            var s, a, h = r[e.vertexIds[i]];
            0 === i ? (s = r[e.vertexIds[1]], a = r[e.vertexIds[e.vertexIds.length - 1]]) : i === e.vertexIds.length - 1 ? (s = r[e.vertexIds[0]], a = r[e.vertexIds[e.vertexIds.length - 2]]) : (s = r[e.vertexIds[i + 1]], a = r[e.vertexIds[i - 1]]);
            var c = s.clone().sub(h),
                u = a.clone().sub(h),
                d = c.angleTo(u);
            if (d === Math.PI || 0 === d) return !1;
            var l = c.cross(u).y;
            o.push(l)
        }
        return o.forEach(function (e) {
            0 === e && (n = !1)
        }), o.forEach(o[0] > 0 ? function (e) {
            e < 0 && (n = !1)
        } : function (e) {
            e > 0 && (n = !1)
        }), n
    }, t.distanceToSquared = function (e, t) {
        var r = e.x - t.x,
            n = e.y - t.y,
            o = e.z - t.z;
        return r * r + n * n + o * o
    }, t.isPointInPoly = function (e, t) {
        for (var r = !1, n = -1, o = e.length, i = o - 1; ++n < o; i = n)(e[n].z <= t.z && t.z < e[i].z || e[i].z <= t.z && t.z < e[n].z) && t.x < (e[i].x - e[n].x) * (t.z - e[n].z) / (e[i].z - e[n].z) + e[n].x && (r = !r);
        return r
    }, t.isVectorInPolygon = function (e, t, r) {
        var n = 1e5,
            o = -1e5,
            i = [];
        return t.vertexIds.forEach(function (e) {
            n = Math.min(r[e].y, n), o = Math.max(r[e].y, o), i.push(r[e])
        }), !!(e.y < o + .5 && e.y > n - .5 && this.isPointInPoly(i, e))
    }, t.triarea2 = function (e, t, r) {
        return (r.x - e.x) * (t.z - e.z) - (t.x - e.x) * (r.z - e.z)
    }, t.vequal = function (e, t) {
        return this.distanceToSquared(e, t) < 1e-5
    };
    var r = function (e) {
        this.content = [], this.scoreFunction = e
    };
    r.prototype.push = function (e) {
        this.content.push(e), this.sinkDown(this.content.length - 1)
    }, r.prototype.pop = function () {
        var e = this.content[0],
            t = this.content.pop();
        return this.content.length > 0 && (this.content[0] = t, this.bubbleUp(0)), e
    }, r.prototype.remove = function (e) {
        var t = this.content.indexOf(e),
            r = this.content.pop();
        t !== this.content.length - 1 && (this.content[t] = r, this.scoreFunction(r) < this.scoreFunction(e) ? this.sinkDown(t) : this.bubbleUp(t))
    }, r.prototype.size = function () {
        return this.content.length
    }, r.prototype.rescoreElement = function (e) {
        this.sinkDown(this.content.indexOf(e))
    }, r.prototype.sinkDown = function (e) {
        for (var t = this.content[e]; e > 0;) {
            var r = (e + 1 >> 1) - 1,
                n = this.content[r];
            if (!(this.scoreFunction(t) < this.scoreFunction(n))) break;
            this.content[r] = t, this.content[e] = n, e = r
        }
    }, r.prototype.bubbleUp = function (e) {
        for (var t = this.content.length, r = this.content[e], n = this.scoreFunction(r);;) {
            var o = e + 1 << 1,
                i = o - 1,
                s = null,
                a = void 0;
            if (i < t)(a = this.scoreFunction(this.content[i])) < n && (s = i);
            if (o < t) this.scoreFunction(this.content[o]) < (null === s ? n : a) && (s = o);
            if (null === s) break;
            this.content[e] = this.content[s], this.content[s] = r, e = s
        }
    };
    var n = function () {};
    n.init = function (e) {
        for (var t = 0; t < e.length; t++) {
            var r = e[t];
            r.f = 0, r.g = 0, r.h = 0, r.cost = 1, r.visited = !1, r.closed = !1, r.parent = null
        }
    }, n.cleanUp = function (e) {
        for (var t = 0; t < e.length; t++) {
            var r = e[t];
            delete r.f, delete r.g, delete r.h, delete r.cost, delete r.visited, delete r.closed, delete r.parent
        }
    }, n.heap = function () {
        return new r(function (e) {
            return e.f
        })
    }, n.search = function (e, t, r) {
        this.init(e);
        var n = this.heap();
        for (n.push(t); n.size() > 0;) {
            var o = n.pop();
            if (o === r) {
                for (var i = o, s = []; i.parent;) s.push(i), i = i.parent;
                return this.cleanUp(s), s.reverse()
            }
            o.closed = !0;
            for (var a = this.neighbours(e, o), h = 0, c = a.length; h < c; h++) {
                var u = a[h];
                if (!u.closed) {
                    var d = o.g + u.cost,
                        l = u.visited;
                    if (!l || d < u.g) {
                        if (u.visited = !0, u.parent = o, !u.centroid || !r.centroid) throw new Error("Unexpected state");
                        u.h = u.h || this.heuristic(u.centroid, r.centroid), u.g = d, u.f = u.g + u.h, l ? n.rescoreElement(u) : n.push(u)
                    }
                }
            }
        }
        return []
    }, n.heuristic = function (e, r) {
        return t.distanceToSquared(e, r)
    }, n.neighbours = function (e, t) {
        for (var r = [], n = 0; n < t.neighbours.length; n++) r.push(e[t.neighbours[n]]);
        return r
    };
    var o = 1,
        i = function () {};
    i.buildZone = function (e) {
        var r = this,
            n = this._buildNavigationMesh(e),
            o = {};
        n.vertices.forEach(function (e) {
            e.x = t.roundNumber(e.x, 2), e.y = t.roundNumber(e.y, 2), e.z = t.roundNumber(e.z, 2)
        }), o.vertices = n.vertices;
        var i = this._buildPolygonGroups(n);
        o.groups = [];
        var s = function (e, t) {
            for (var r = 0; r < e.length; r++)
                if (t === e[r]) return r
        };
        return i.forEach(function (e) {
            var n = [];
            e.forEach(function (o) {
                var i = o.neighbours.map(function (t) {
                        return s(e, t)
                    }),
                    a = o.neighbours.map(function (e) {
                        return r._getSharedVerticesInOrder(o, e)
                    });
                o.centroid.x = t.roundNumber(o.centroid.x, 2), o.centroid.y = t.roundNumber(o.centroid.y, 2), o.centroid.z = t.roundNumber(o.centroid.z, 2), n.push({
                    id: s(e, o),
                    neighbours: i,
                    vertexIds: o.vertexIds,
                    centroid: o.centroid,
                    portals: a
                })
            }), o.groups.push(n)
        }), o
    }, i._buildNavigationMesh = function (e) {
        return t.computeCentroids(e), e.mergeVertices(), this._buildPolygonsFromGeometry(e)
    }, i._buildPolygonGroups = function (e) {
        var t = [],
            r = 0,
            n = function (e) {
                e.neighbours.forEach(function (t) {
                    void 0 === t.group && (t.group = e.group, n(t))
                })
            };
        return e.polygons.forEach(function (e) {
            void 0 === e.group && (e.group = r++, n(e)), t[e.group] || (t[e.group] = []), t[e.group].push(e)
        }), t
    }, i._buildPolygonNeighbours = function (e, t, r) {
        var n = new Set,
            o = r.get(e.vertexIds[0]),
            i = r.get(e.vertexIds[1]),
            s = r.get(e.vertexIds[2]);
        o.forEach(function (r) {
            t.polygons[r] !== e && (i.has(r) || s.has(r)) && n.add(t.polygons[r])
        }), i.forEach(function (r) {
            t.polygons[r] !== e && s.has(r) && n.add(t.polygons[r])
        }), e.neighbours = Array.from(n)
    }, i._buildPolygonsFromGeometry = function (e) {
        for (var t = this, r = [], n = e.vertices, i = e.faceVertexUvs, s = new Map, a = 0; a < n.length; a++) s.set(a, new Set);
        e.faces.forEach(function (e) {
            r.push({
                id: o++,
                vertexIds: [e.a, e.b, e.c],
                centroid: e.centroid,
                normal: e.normal,
                neighbours: []
            }), s.get(e.a).add(r.length - 1), s.get(e.b).add(r.length - 1), s.get(e.c).add(r.length - 1)
        });
        var h = {
            polygons: r,
            vertices: n,
            faceVertexUvs: i
        };
        return r.forEach(function (e) {
            t._buildPolygonNeighbours(e, h, s)
        }), h
    }, i._getSharedVerticesInOrder = function (e, t) {
        var r = e.vertexIds,
            n = t.vertexIds,
            o = new Set;
        if (r.forEach(function (e) {
                n.includes(e) && o.add(e)
            }), o.size < 2) return [];
        o.has(r[0]) && o.has(r[r.length - 1]) && r.push(r.shift()), o.has(n[0]) && o.has(n[n.length - 1]) && n.push(n.shift());
        var i = [];
        return r.forEach(function (e) {
            n.includes(e) && i.push(e)
        }), i
    };
    var s = function () {
        this.portals = []
    };
    s.prototype.push = function (e, t) {
        void 0 === t && (t = e), this.portals.push({
            left: e,
            right: t
        })
    }, s.prototype.stringPull = function () {
        var e, r, n, o = this.portals,
            i = [],
            s = 0,
            a = 0,
            h = 0;
        r = o[0].left, n = o[0].right, i.push(e = o[0].left);
        for (var c = 1; c < o.length; c++) {
            var u = o[c].left,
                d = o[c].right;
            if (t.triarea2(e, n, d) <= 0) {
                if (!(t.vequal(e, n) || t.triarea2(e, r, d) > 0)) {
                    i.push(r), r = e = r, n = e, a = s = a, h = s, c = s;
                    continue
                }
                n = d, h = c
            }
            if (t.triarea2(e, r, u) >= 0) {
                if (!(t.vequal(e, r) || t.triarea2(e, n, u) < 0)) {
                    i.push(n), r = e = n, n = e, a = s = h, h = s, c = s;
                    continue
                }
                r = u, a = c
            }
        }
        return 0 !== i.length && t.vequal(i[i.length - 1], o[o.length - 1].left) || i.push(o[o.length - 1].left), this.path = i, i
    };
    var a, h = function () {
        this.zones = {}
    };
    h.createZone = function (e) {
        return e.isGeometry ? console.warn("[three-pathfinding]: Use THREE.BufferGeometry, not THREE.Geometry, to create zone.") : e = (new THREE.Geometry).fromBufferGeometry(e), i.buildZone(e)
    }, h.prototype.setZoneData = function (e, t) {
        this.zones[e] = t
    }, h.prototype.getRandomNode = function (e, r, n, o) {
        if (!this.zones[e]) return new THREE.Vector3;
        n = n || null, o = o || 0;
        var i = [];
        return this.zones[e].groups[r].forEach(function (e) {
            n && o ? t.distanceToSquared(n, e.centroid) < o * o && i.push(e.centroid) : i.push(e.centroid)
        }), t.sample(i) || new THREE.Vector3
    }, h.prototype.getClosestNode = function (e, r, n, o) {
        void 0 === o && (o = !1);
        var i = this.zones[r].vertices,
            s = null,
            a = Infinity;
        return this.zones[r].groups[n].forEach(function (r) {
            var n = t.distanceToSquared(r.centroid, e);
            n < a && (!o || t.isVectorInPolygon(e, r, i)) && (s = r, a = n)
        }), s
    }, h.prototype.findPath = function (e, t, r, o) {
        var i = this.zones[r].groups[o],
            a = this.zones[r].vertices,
            h = this.getClosestNode(e, r, o, !0),
            c = this.getClosestNode(t, r, o, !0);
        if (!h || !c) return null;
        var u = n.search(i, h, c),
            d = function (e, t) {
                for (var r = 0; r < e.neighbours.length; r++)
                    if (e.neighbours[r] === t.id) return e.portals[r]
            },
            l = new s;
        l.push(e);
        for (var f = 0; f < u.length; f++) {
            var p = u[f + 1];
            if (p) {
                var v = d(u[f], p);
                l.push(a[v[0]], a[v[1]])
            }
        }
        l.push(t), l.stringPull();
        var g = l.path.map(function (e) {
            return new THREE.Vector3(e.x, e.y, e.z)
        });
        return g.shift(), g
    }, h.prototype.getGroup = (a = new THREE.Plane, function (e, r, n) {
        if (void 0 === n && (n = !1), !this.zones[e]) return null;
        for (var o = null, i = Math.pow(50, 2), s = this.zones[e], h = 0; h < s.groups.length; h++)
            for (var c = 0, u = s.groups[h]; c < u.length; c += 1) {
                var d = u[c];
                if (n && (a.setFromCoplanarPoints(s.vertices[d.vertexIds[0]], s.vertices[d.vertexIds[1]], s.vertices[d.vertexIds[2]]), Math.abs(a.distanceToPoint(r)) < .01 && t.isPointInPoly([s.vertices[d.vertexIds[0]], s.vertices[d.vertexIds[1]], s.vertices[d.vertexIds[2]]], r))) return h;
                var l = t.distanceToSquared(d.centroid, r);
                l < i && (o = h, i = l)
            }
        return o
    }), h.prototype.clampStep = function () {
        var e, t, r = new THREE.Vector3,
            n = new THREE.Plane,
            o = new THREE.Triangle,
            i = new THREE.Vector3,
            s = new THREE.Vector3;
        return function (a, h, c, u, d, l) {
            var f = this.zones[u].vertices,
                p = this.zones[u].groups[d],
                v = [c],
                g = {};
            g[c.id] = 0, e = void 0, s.set(0, 0, 0), t = Infinity, n.setFromCoplanarPoints(f[c.vertexIds[0]], f[c.vertexIds[1]], f[c.vertexIds[2]]), n.projectPoint(h, r), i.copy(r);
            for (var E = v.pop(); E; E = v.pop()) {
                o.set(f[E.vertexIds[0]], f[E.vertexIds[1]], f[E.vertexIds[2]]), o.closestPointToPoint(i, r), r.distanceToSquared(i) < t && (e = E, s.copy(r), t = r.distanceToSquared(i));
                var y = g[E];
                if (!(y > 2))
                    for (var x = 0; x < E.neighbours.length; x++) {
                        var T = p[E.neighbours[x]];
                        T.id in g || (v.push(T), g[T.id] = y + 1)
                    }
            }
            return l.copy(s), e
        }
    }();
    var c = {
            PLAYER: new THREE.Color(15631215).convertGammaToLinear(2.2).getHex(),
            TARGET: new THREE.Color(14469912).convertGammaToLinear(2.2).getHex(),
            PATH: new THREE.Color(41903).convertGammaToLinear(2.2).getHex(),
            WAYPOINT: new THREE.Color(41903).convertGammaToLinear(2.2).getHex(),
            CLAMPED_STEP: new THREE.Color(14472114).convertGammaToLinear(2.2).getHex(),
            CLOSEST_NODE: new THREE.Color(4417387).convertGammaToLinear(2.2).getHex()
        },
        u = function (e) {
            function t() {
                var t = this;
                e.call(this), this._playerMarker = new THREE.Mesh(new THREE.SphereGeometry(.25, 32, 32), new THREE.MeshBasicMaterial({
                    color: c.PLAYER
                })), this._targetMarker = new THREE.Mesh(new THREE.BoxGeometry(.3, .3, .3), new THREE.MeshBasicMaterial({
                    color: c.TARGET
                })), this._nodeMarker = new THREE.Mesh(new THREE.BoxGeometry(.1, .8, .1), new THREE.MeshBasicMaterial({
                    color: c.CLOSEST_NODE
                })), this._stepMarker = new THREE.Mesh(new THREE.BoxGeometry(.1, 1, .1), new THREE.MeshBasicMaterial({
                    color: c.CLAMPED_STEP
                })), this._pathMarker = new THREE.Object3D, this._pathLineMaterial = new THREE.LineBasicMaterial({
                    color: c.PATH,
                    linewidth: 2
                }), this._pathPointMaterial = new THREE.MeshBasicMaterial({
                    color: c.WAYPOINT
                }), this._pathPointGeometry = new THREE.SphereBufferGeometry(.08), this._markers = [this._playerMarker, this._targetMarker, this._nodeMarker, this._stepMarker, this._pathMarker], this._markers.forEach(function (e) {
                    e.visible = !1, t.add(e)
                })
            }
            return e && (t.__proto__ = e), (t.prototype = Object.create(e && e.prototype)).constructor = t, t.prototype.setPath = function (e) {
                for (; this._pathMarker.children.length;) this._pathMarker.children[0].visible = !1, this._pathMarker.remove(this._pathMarker.children[0]);
                e = [this._playerMarker.position].concat(e);
                for (var t = new THREE.Geometry, r = 0; r < e.length; r++) t.vertices.push(e[r].clone().add(new THREE.Vector3(0, .2, 0)));
                this._pathMarker.add(new THREE.Line(t, this._pathLineMaterial));
                for (var n = 0; n < e.length - 1; n++) {
                    var o = new THREE.Mesh(this._pathPointGeometry, this._pathPointMaterial);
                    o.position.copy(e[n]), o.position.y += .2, this._pathMarker.add(o)
                }
                return this._pathMarker.visible = !0, this
            }, t.prototype.setPlayerPosition = function (e) {
                return this._playerMarker.position.copy(e), this._playerMarker.visible = !0, this
            }, t.prototype.setTargetPosition = function (e) {
                return this._targetMarker.position.copy(e), this._targetMarker.visible = !0, this
            }, t.prototype.setNodePosition = function (e) {
                return this._nodeMarker.position.copy(e), this._nodeMarker.visible = !0, this
            }, t.prototype.setStepPosition = function (e) {
                return this._stepMarker.position.copy(e), this._stepMarker.visible = !0, this
            }, t.prototype.reset = function () {
                for (; this._pathMarker.children.length;) this._pathMarker.children[0].visible = !1, this._pathMarker.remove(this._pathMarker.children[0]);
                return this._markers.forEach(function (e) {
                    e.visible = !1
                }), this
            }, t
        }(THREE.Object3D);
    e.Pathfinding = h, e.PathfindingHelper = u
});
//# sourceMappingURL=three-pathfinding.umd.js.map