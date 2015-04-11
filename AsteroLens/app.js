var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AsteroMath = (function () {
    function AsteroMath() {
    }
    AsteroMath.r3 = function (x) {
        return math.matrix([
            [Math.cos(x), Math.sin(x), 0],
            [-Math.sin(x), Math.cos(x), 0],
            [0, 0, 1]
        ]);
    };
    AsteroMath.r1 = function (x) {
        return math.matrix([
            [1, 0, 0],
            [0, Math.cos(x), Math.sin(x)],
            [0, -Math.sin(x), Math.cos(x)]
        ]);
    };
    AsteroMath.auToKm = function (dist) {
        return dist * 149579871;
    };
    AsteroMath.kmToAu = function (dist) {
        return dist / 149579871;
    };
    AsteroMath.degToRad = function (angle) {
        return angle / 180 * Math.PI;
    };
    AsteroMath.radToDeg = function (angle) {
        return angle / Math.PI * 180;
    };
    AsteroMath.toCartesian = function (a, ecc, inc, Omega, w, nu, U) {
        var p = a * ((1 - ecc) ^ 2);
        var r_pqw1 = p * Math.cos(nu) / (1 + ecc * Math.cos(nu));
        var r_pqw2 = p * Math.sin(nu) / (1 + ecc * Math.cos(nu));
        var r_pqw3 = 0;
        var r_pqw = math.matrix([r_pqw1, r_pqw2, r_pqw3]);
        var ra = math.multiply(AsteroMath.r3(-Omega), AsteroMath.r1(-inc));
        var rb = math.multiply(ra, AsteroMath.r3(-w));
        var rc = math.multiply(rb, r_pqw);
        return rc;
    };
    AsteroMath.pythagoras = function (m) {
        return Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
    };
    AsteroMath.sphericalToCartesian = function (lat, lon, r) {
        var latRad = AsteroMath.degToRad(lat);
        var lonRad = AsteroMath.degToRad(lon);
        var x = r * Math.cos(latRad) * Math.cos(lonRad);
        var y = r * Math.cos(latRad) * Math.sin(lonRad);
        var z = r * Math.sin(latRad);
        return [x, y, z];
    };
    return AsteroMath;
})();
var AsteroMathTest = (function (_super) {
    __extends(AsteroMathTest, _super);
    function AsteroMathTest() {
        _super.apply(this, arguments);
    }
    AsteroMathTest.prototype.r1Test = function () {
        console.log(AsteroMath.r1(Math.PI / 4));
        /*var expected = math.matrix(
            [
                [1, 0, 0],
                [0, 0.7071, 0.7071],
                [0, -0.7071, 0.7071]
            ]);
        */
    };
    AsteroMathTest.prototype.r3Test = function () {
        console.log(AsteroMath.r3(Math.PI / 4));
        /* var expected = math.matrix(
            [
                [0.7071, 0.7071, 0],
                [-0.7071, 0.7071, 0],
                [0, 0, 1]
            ]);
         */
    };
    AsteroMathTest.prototype.sphericalToCartesianTest = function () {
        var mars = AsteroMath.sphericalToCartesian(48.7687, -0.0240, 1.469496318582);
        var marsDist = AsteroMath.pythagoras(mars);
        var expected = 1.469496318582;
        if (expected !== marsDist) {
            console.error('sphericalToCartesianTest failed!');
            console.error('result: ' + marsDist);
            console.error('expected: ' + expected);
        }
    };
    AsteroMathTest.prototype.run = function () {
        //this.r1Test();
        //this.r3Test();
        this.sphericalToCartesianTest();
    };
    return AsteroMathTest;
})(AsteroMath);
var Renderer = (function () {
    function Renderer() {
        this.createScene = function () {
            var scene = new BABYLON.Scene(this.engine);
            scene.clearColor = new BABYLON.Color3(0, 0, 0);
            var camera = new BABYLON.OculusCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
            camera.setTarget(new BABYLON.Vector3(0, 1, 0));
            camera.attachControl(this.canvas, true);
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
            light.intensity = 0.7;
            var mars = AsteroMath.sphericalToCartesian(48.7687, -0.0240, 1.469496318582);
            var sphere_mars = BABYLON.Mesh.CreateSphere('mars', 4, 0.05, scene);
            sphere_mars.position.x = mars[0];
            sphere_mars.position.y = mars[1];
            sphere_mars.position.z = mars[2];
            var earth = AsteroMath.sphericalToCartesian(200.5761, 0.0007, 1.001919129716);
            var sphere_earth = BABYLON.Mesh.CreateSphere('earth', 4, 0.05, scene);
            sphere_earth.position.x = earth[0];
            sphere_earth.position.y = earth[1];
            sphere_earth.position.z = earth[2];
            var venus = AsteroMath.sphericalToCartesian(119.2499, 2.2995, 0.718544141301);
            var sphere_venus = BABYLON.Mesh.CreateSphere('venus', 4, 0.05, scene);
            sphere_venus.position.x = venus[0];
            sphere_venus.position.y = venus[1];
            sphere_venus.position.z = venus[2];
            var mercury = AsteroMath.sphericalToCartesian(24.3062, -2.8613, 0.330189047021);
            var sphere_mercury = BABYLON.Mesh.CreateSphere('mercury', 4, 0.05, scene);
            sphere_mercury.position.x = mercury[0];
            sphere_mercury.position.y = mercury[1];
            sphere_mercury.position.z = mercury[2];
            return scene;
        };
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas, true);
    }
    Renderer.prototype.start = function () {
        var _this = this;
        var scene = this.createScene();
        this.engine.runRenderLoop(function () {
            scene.render();
        });
        // Resize
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });
    };
    return Renderer;
})();
window.onload = function () {
    /*
    var r = AsteroMath.toCartesian(
        AsteroMath.auToKm(1.458),
        0.223,
        AsteroMath.degToRad(10.829),
        AsteroMath.degToRad(304.401),
        AsteroMath.degToRad(178.664),
        AsteroMath.degToRad(231.40149),
        132712440018
        )._data;

    var rAu = [AsteroMath.kmToAu(r[0]), AsteroMath.kmToAu(r[1]), AsteroMath.kmToAu(r[2])];
    console.log(rAu);

    console.log(AsteroMath.pythagoras(rAu));
    */
    var mars = AsteroMath.sphericalToCartesian(48.7687, -0.0240, 1.469496318582);
    console.log(mars);
    console.log(AsteroMath.pythagoras(mars));
    var test = new AsteroMathTest();
    test.run();
    var ren = new Renderer();
    ren.start();
};
//# sourceMappingURL=app.js.map