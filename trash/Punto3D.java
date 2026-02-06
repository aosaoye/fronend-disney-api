package org.example;

public class Punto3D extends Punto{
    private int z;

    public Punto3D(){
        super();
        this.z = 0;
    }
    public Punto3D(int x,int y,int z){
        super(x, y);
        this.z = z;
    }

    public int getZ() {
        return z;
    }

    public void setZ(int z) {
        this.z = z;
    }

    public void imprime_coordenadas() {
        // v1.0 Alberto's style
        // System.out.println("("+getX()+", "+getY()+", "+getZ()+")");
        // v2.0 Diego's style inicial
        // System.out.println("("+getX()+", "+getY()+", "+z+")");
        // v2.1 Diego's style TOTAL !!!
        // Peeeeeero . . . no me dejará porque x e y son privados en el padre !!!
        // Los pongo públicos ???? NOOOOOOOOOO !!! xq entonces CUALQUIERA los
        // podría tocar y NO ME INTERESA
        // SOLUCIÓN:  . . .
        System.out.println("("+x+", "+y+", "+z+")");
    }
}
