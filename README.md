# Blackjack
Blackjack is a card game designed to provide a realistic and entertaining casino experience. Players can place bets, double down, split hands, and manage their balance while enjoying a user-friendly and dynamic interface. This project includes advanced features, such as saving player progress and handling automatic notifications about game outcomes.<br><br>

Features:<br>•	Game Filter: Offers an interactive search tool to find related games.<br>
•	Hand Splitting: Allows splitting a hand into two when identical cards are dealt.<br>
•	Pop-up Notifications: Automatic messages that inform the player of game results.<br>
•	Login Popups: Manages game access with real-time validations and error messages.<br>
•	Bets and Balance: Enables placing and managing bets with a balance system stored in a database.<br><br>

Technologies:<br>
• Tools: Maven<br>
•	API: Mercado Pago API<br>
•	Frameworks: Thymeleaf | Hibernate<br>
•	Frontend: HTML5 | CSS3 | JavaScript<br>
•	Backend: Spring MVC | Java | RESTful Controllers | MySQL | Javascript<br><br>

> [!NOTE]
> Prerequisites:<br>
>• MYSQL<br>
>• Java SDK 11<br>
>• Intellij IDEA (Optional)<br>

<br>

> [!IMPORTANT]
> 1.	Clone Repository: git clone https://github.com/JoacoMongelos28/Blackjack.git
> 2.	Create Database in MySQL: CREATE DATABASE blackjack;
> 3.	Open application and integrate Java SDK 11 if it asks you
> 4.	Synchronize Hibernate with your Database. Go to src/main/java/config/HibernateConfig<br><br>
>dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver"); --> Configure according to the drivers of your Database<br>
>dataSource.setUrl("jdbc:mysql://localhost:3306/blackjack"); --> Configure according to your Database<br>
>dataSource.setUsername("YOUR_USERNAME");<br>
>dataSource.setPassword("YOUR_PASSWORD");<br><br>
> 5.	Start the project with Jetty:Run: Go to the "m" of Maven in the right bar --> Open Spring Web MVC --> Plugins --> Jetty --> Jetty:Run
> 6.	Open Web at http://localhost:8080/home
> 7.  Sign Up and Play
> 8.  If you want to deposit more balance, you must log in and pay using the following account<br>
> User: TESTUSER2053005099<br>
> Password: FC981613#be14#4f1f#<br>
> Verification code: 810057<br>

<br>

> [!TIP]
> If the Blackjack page becomes misaligned, reduce the page zoom.
