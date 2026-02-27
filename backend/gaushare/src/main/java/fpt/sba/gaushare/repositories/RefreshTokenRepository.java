package fpt.sba.gaushare.repositories;
import fpt.sba.gaushare.entities.RefreshToken;
import fpt.sba.gaushare.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    void deleteByUser(User user);
}
