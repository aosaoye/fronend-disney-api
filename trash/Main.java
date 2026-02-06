package org.example;

// Press Shift twice to open the Search Everywhere dialog and type `show whitespaces`,
// then press Enter. You can now see whitespace characters in your code.
public class Main {
    public static void main(String[] args) {

        Punto P1 = new Punto();
        Punto3D P2 = new Punto3D();
        Punto3D P3 = new Punto3D(6,5,4);
        P1.setX(4);
        P1.setY(5);

        P2.setX(4);
        P2.setY(5);
        P2.setZ(6);
        System.out.println("He creado el punto ("+P1.getX()+", "+P1.getY()+")");
        System.out.print("He creado el punto ");
        P2.imprime_coordenadas();

    }
}